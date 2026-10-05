"""評価算出の本体。

処理の流れ:
  1. 事業所×月ごとに、適用する基準値を決めて指標を計算し、スコアを出す
  2. 事業所ごとに当月・期間平均をまとめ、例外条件を当てて判定(通常/参考評価/要確認)を決める
  3. 対象者(事業所責任者・エリアマネージャー)ごとに、評価に使える月を決めてスコアを出し、例外条件を当てる
  4. 抽出条件に従って、業務改善報告書対象者・再教育対象者を抽出する

計算には乱数や AI の判断を使わないので、同じ入力とルールからは必ず同じ結果になる。
すべての数値について、どのデータとどのルール行から出したかを算出根拠として残す。
"""

from dataclasses import dataclass

import pandas as pd

from .loader import InputData
from .rules import Rules

# 判定の優先度(大きいほど強い)。複数の例外に当たったら一番強いものを採用する。
JUDGMENT_PRIORITY = {"通常": 0, "参考評価": 1, "要確認": 2, "対象外": 3}


@dataclass
class EvaluationResult:
    target_month: pd.Period
    period: list[pd.Period]
    facilities: pd.DataFrame
    facility_monthly: pd.DataFrame
    facility_detail: pd.DataFrame
    persons: pd.DataFrame
    person_detail: pd.DataFrame
    extracted: dict[str, pd.DataFrame]
    review: pd.DataFrame
    percentiles: pd.DataFrame


def _months_inclusive(start: pd.Period, end: pd.Period) -> int:
    """start の月から end の月までの月数(両端を含む)。"""
    return (end - start).n + 1


def _strongest(judgments: list[str]) -> str:
    return max(judgments, key=JUDGMENT_PRIORITY.get, default="通常")


def compute_metric(name: str, actual: pd.Series, capacity: float) -> tuple[float | None, str]:
    """指標の値と計算式(根拠として残す文字列)を返す。計算できなければ値は None。"""
    visits, units, days, staff = actual["延べ利用者数"], actual["算定単位数"], actual["営業日数"], actual["スタッフ数"]
    if name == "稼働率":
        if pd.isna(capacity) or not days:
            return None, "定員または営業日数がないため計算不可"
        return visits / (capacity * days) * 100, f"延べ利用者数{visits:,.0f} ÷ (定員{capacity:.0f} × 営業日数{days:.0f}) × 100"
    if name == "延べ利用者数":
        return float(visits), f"延べ利用者数{visits:,.0f}"
    if name == "算定単位数":
        return float(units), f"算定単位数{units:,.0f}"
    if name == "1人当たり単位数":
        if not staff:
            return None, "スタッフ数が0のため計算不可"
        return units / staff, f"算定単位数{units:,.0f} ÷ スタッフ数{staff:g}"
    if name == "1人当たり利用者数":
        if not staff:
            return None, "スタッフ数が0のため計算不可"
        return visits / staff, f"延べ利用者数{visits:,.0f} ÷ スタッフ数{staff:g}"
    raise ValueError(f"未対応の指標です: {name}")


def evaluate(data: InputData, rules: Rules, target_month: pd.Period) -> EvaluationResult:
    period = list(pd.period_range(end=target_month, periods=rules.period_months, freq="M"))
    review: list[dict] = []

    # 入力チェックで見つかった不備は、そのまま要確認一覧に載せる
    names = dict(zip(data.facilities["事業所ID"], data.facilities["事業所名"]))
    names.update(dict(zip(data.assignments["社員ID"], data.assignments["氏名"])))
    for issue in data.issues:
        review.append({**issue, "名称": names.get(issue["対象ID"], ""), "ルールID": ""})

    monthly, detail = _score_facility_months(data, rules, period, review)
    facilities = _summarize_facilities(data, rules, target_month, period, monthly, detail, review)
    persons, person_detail = _evaluate_persons(data, rules, target_month, period, monthly, facilities, review)
    extracted = _extract(rules, persons, person_detail, review)
    percentiles = _percentiles(facilities, detail, target_month)

    review_df = pd.DataFrame(review, columns=["区分", "対象種別", "対象ID", "名称", "年月", "内容", "ルールID"])
    review_df[["確認者", "確認結果", "確認日"]] = ""  # 人が記入する承認欄
    return EvaluationResult(target_month, period, facilities, monthly, detail, persons, person_detail,
                            extracted, review_df, percentiles)


def _score_facility_months(data: InputData, rules: Rules, period: list[pd.Period], review: list[dict]):
    actuals = data.results.set_index(["事業所ID", "年月"])
    monthly_rows, detail_rows = [], []
    missing_baseline = set()

    for fac in data.facilities.drop_duplicates("事業所ID").itertuples():
        for month in period:
            if month < fac.開設年月:
                continue
            category = "新規" if (month - fac.開設年月).n < rules.new_facility_months else "既存"
            row = {"事業所ID": fac.事業所ID, "年月": month, "開設区分": category, "スコア": None, "状態": ""}
            baselines = rules.baselines[(rules.baselines["事業種別"] == fac.事業種別)
                                        & (rules.baselines["開設区分"] == category)]
            if baselines.empty:
                row["状態"] = "基準値なし"
                if (fac.事業種別, category) not in missing_baseline:
                    missing_baseline.add((fac.事業種別, category))
                    review.append({"区分": "ルール不足", "対象種別": "事業所", "対象ID": fac.事業所ID,
                                   "名称": fac.事業所名, "年月": str(month), "ルールID": "",
                                   "内容": f"基準値表に「{fac.事業種別}/{category}」の行がありません"})
            elif (fac.事業所ID, month) not in actuals.index:
                row["状態"] = "実績なし"
            else:
                actual = actuals.loc[(fac.事業所ID, month)]
                weighted, weights, failed = 0.0, 0.0, False
                for b in baselines.itertuples():
                    value, formula = compute_metric(b.指標, actual, fac.定員)
                    achievement = None
                    if value is None:
                        failed = True
                    else:
                        achievement = min(value / b.基準値 * 100, rules.achievement_cap)
                        weighted += achievement * b.重み
                        weights += b.重み
                    detail_rows.append({
                        "事業所ID": fac.事業所ID, "事業所名": fac.事業所名, "年月": month, "事業種別": fac.事業種別,
                        "開設区分": category, "指標": b.指標, "実績値": value, "計算式": formula,
                        "基準値": b.基準値, "基準値表の行": b.行, "達成率(%)": achievement, "重み": b.重み,
                    })
                if failed or not weights:
                    row["状態"] = "計算不可"
                else:
                    row["スコア"] = round(weighted / weights, 1)
                    row["状態"] = "算出済"
            monthly_rows.append(row)

    monthly = pd.DataFrame(monthly_rows, columns=["事業所ID", "年月", "開設区分", "スコア", "状態"])
    monthly["ランク"] = monthly["スコア"].map(rules.rank_of)
    return monthly, pd.DataFrame(detail_rows)


def _summarize_facilities(data, rules, target_month, period, monthly, detail, review):
    exceptions = rules.exceptions[rules.exceptions["対象"] == "事業所"]
    issue_ids = {i["対象ID"] for i in data.issues if i["対象種別"] == "事業所"}
    rows = []
    for fac in data.facilities.drop_duplicates("事業所ID").itertuples():
        own = monthly[monthly["事業所ID"] == fac.事業所ID]
        scored = own.dropna(subset=["スコア"])
        current = own[own["年月"] == target_month]
        judgments, applied, pending = ["通常"], [], []

        def apply(rule, message: str, month: str = "") -> None:
            judgments.append(rule.処理)
            applied.append(f"{rule.ルールID}:{rule.説明}")
            if rule.処理 == "要確認":
                pending.append({"区分": "例外条件", "対象種別": "事業所", "対象ID": fac.事業所ID,
                                "名称": fac.事業所名, "年月": month, "ルールID": rule.ルールID, "内容": message})

        opened_months = _months_inclusive(fac.開設年月, target_month)
        missing = own[own["状態"] == "実績なし"]
        for rule in exceptions.itertuples():
            if rule.条件 == "開設経過月数_未満" and opened_months < rule.閾値:
                apply(rule, f"開設{opened_months}ヶ月")
            elif rule.条件 == "欠損月数_以上" and len(missing) >= rule.閾値:
                apply(rule, f"実績が未提出の月: {', '.join(missing['年月'].astype(str))}",
                      ", ".join(missing["年月"].astype(str)))
            elif rule.条件 == "稼働率_超過" and not detail.empty:
                over = detail[(detail["事業所ID"] == fac.事業所ID) & (detail["指標"] == "稼働率")
                              & (detail["実績値"] > rule.閾値)]
                if not over.empty:
                    months = ", ".join(f"{r.年月}({r.実績値:.0f}%)" for r in over.itertuples())
                    apply(rule, f"稼働率が{rule.閾値:g}%を超える月: {months}", ", ".join(over["年月"].astype(str)))
        if fac.事業所ID in issue_ids:
            judgments.append("要確認")
            applied.append("入力データに不備あり(要確認一覧を参照)")

        judgment = _strongest(judgments)
        if judgment == "要確認":  # 対象外になったものは確認不要なので一覧に載せない
            review.extend(pending)

        current_score = current["スコア"].iloc[0] if not current.empty else None
        average = round(scored["スコア"].mean(), 1) if not scored.empty else None
        rows.append({
            "事業所ID": fac.事業所ID, "事業所名": fac.事業所名, "事業種別": fac.事業種別, "エリア": fac.エリア,
            "開設年月": str(fac.開設年月),
            "開設区分(当月)": current["開設区分"].iloc[0] if not current.empty else "",
            "当月スコア": current_score, "当月ランク": rules.rank_of(current_score),
            f"{len(period)}ヶ月平均スコア": average, f"{len(period)}ヶ月平均ランク": rules.rank_of(average),
            "評価月数": len(scored), "判定": judgment, "適用ルール": " / ".join(applied),
        })

    df = pd.DataFrame(rows)
    # パーセンタイル順位は「通常」判定の事業所だけで比べる(参考評価・要確認は母集団に入れない)
    normal = df["判定"] == "通常"
    avg_col = f"{len(period)}ヶ月平均スコア"
    df["当月パーセンタイル"] = df.loc[normal, "当月スコア"].rank(pct=True).mul(100).round(0)
    df["平均パーセンタイル"] = df.loc[normal, avg_col].rank(pct=True).mul(100).round(0)
    df["当月順位"] = df.loc[normal, "当月スコア"].rank(ascending=False, method="min").astype("Int64")
    df["平均順位"] = df.loc[normal, avg_col].rank(ascending=False, method="min").astype("Int64")
    return df


def _evaluate_persons(data, rules, target_month, period, monthly, facilities, review):
    exceptions = rules.exceptions[rules.exceptions["対象"] == "対象者"]
    fac_judgment = facilities.set_index("事業所ID")
    normal_ids = set(facilities.loc[facilities["判定"] == "通常", "事業所ID"])
    scores = monthly.set_index(["事業所ID", "年月"])["スコア"]
    leaves = data.leaves
    rows, detail_rows = [], []

    for p in data.assignments.itertuples():
        on_leave = set()
        for lv in leaves[leaves["社員ID"] == p.社員ID].itertuples():
            end = lv.休職終了年月 if pd.notna(lv.休職終了年月) else target_month
            on_leave.update(pd.period_range(lv.休職開始年月, end, freq="M"))

        used = []
        leave_months = 0
        for month in period:
            source = ""
            if month < p.着任年月:
                status, score = "着任前", None
            elif pd.notna(p.離任年月) and month > p.離任年月:
                status, score = "離任後", None
            elif month in on_leave:
                status, score = "休職", None
                leave_months += 1
            elif p.役職 == "事業所責任者":
                score = scores.get((p.事業所ID, month))
                status = "評価に使用" if pd.notna(score) else "事業所の実績なし"
                source = p.事業所ID
            else:
                # エリアマネージャーは、担当エリア内の「通常」判定の事業所の平均で評価する
                area_ids = sorted(normal_ids & set(facilities.loc[facilities["エリア"] == p.エリア, "事業所ID"]))
                area_scores = [scores.get((fid, month)) for fid in area_ids]
                area_scores = [s for s in area_scores if pd.notna(s)]
                score = round(sum(area_scores) / len(area_scores), 1) if area_scores else None
                status = "評価に使用" if score is not None else "エリアの実績なし"
                source = f"{p.エリア}の{len(area_scores)}事業所の平均({', '.join(area_ids)})"
            if status == "評価に使用":
                used.append((month, score))
            detail_rows.append({"社員ID": p.社員ID, "氏名": p.氏名, "役職": p.役職, "年月": month, "状態": status,
                                "スコア": score, "ランク": rules.rank_of(score), "参照元": source})

        judgments, applied, pending = ["通常"], [], []

        def apply(rule, message: str) -> None:
            judgments.append(rule.処理)
            applied.append(f"{rule.ルールID}:{rule.説明}")
            if rule.処理 == "要確認":
                pending.append({"区分": "例外条件", "対象種別": "対象者", "対象ID": p.社員ID, "名称": p.氏名,
                                "年月": "", "ルールID": rule.ルールID, "内容": message})

        still_assigned = pd.isna(p.離任年月) or p.離任年月 >= target_month
        tenure = _months_inclusive(p.着任年月, target_month)
        for rule in exceptions.itertuples():
            if rule.条件 == "着任経過月数_未満" and still_assigned and tenure < rule.閾値:
                apply(rule, f"着任{tenure}ヶ月")
            elif rule.条件 == "休職月数_以上" and leave_months >= rule.閾値:
                apply(rule, f"休職{leave_months}ヶ月")
            elif rule.条件 == "評価月数_未満" and len(used) < rule.閾値:
                apply(rule, f"評価に使える月が{len(used)}ヶ月")

        # 事業所責任者は、担当事業所の判定(参考評価・要確認)を引き継ぐ
        if p.役職 == "事業所責任者" and p.事業所ID in fac_judgment.index:
            inherited = fac_judgment.loc[p.事業所ID, "判定"]
            if inherited != "通常":
                judgments.append(inherited)
                applied.append(f"担当事業所({p.事業所ID})の判定「{inherited}」を継承")

        judgment = _strongest(judgments)
        if judgment == "要確認":
            review.extend(pending)

        current = next((s for m, s in used if m == target_month), None)
        average = round(sum(s for _, s in used) / len(used), 1) if used else None
        rows.append({
            "社員ID": p.社員ID, "氏名": p.氏名, "役職": p.役職,
            "担当": p.事業所ID if p.役職 == "事業所責任者" else p.エリア,
            "担当名": fac_judgment.loc[p.事業所ID, "事業所名"] if p.事業所ID in fac_judgment.index else p.エリア,
            "着任年月": str(p.着任年月), "離任年月": str(p.離任年月) if pd.notna(p.離任年月) else "",
            "当月スコア": current, "当月ランク": rules.rank_of(current),
            f"{len(period)}ヶ月平均スコア": average, f"{len(period)}ヶ月平均ランク": rules.rank_of(average),
            "評価月数": len(used), "評価に使った月": ", ".join(str(m) for m, _ in used),
            "判定": judgment, "適用ルール": " / ".join(applied),
        })

    return pd.DataFrame(rows), pd.DataFrame(detail_rows)


def _matches(rules: Rules, condition, person: pd.Series, history: pd.DataFrame, avg_col: str) -> bool:
    if condition.条件 == "平均スコア_未満":
        return pd.notna(person[avg_col]) and person[avg_col] < float(condition.閾値)
    if condition.条件 == "当月ランク_以下":
        return bool(person["当月ランク"]) and rules.rank_order(person["当月ランク"]) >= rules.rank_order(condition.閾値)
    if condition.条件 == "連続ランク_以下":
        months = int(condition.閾値2 or 1)
        recent = history.tail(months)
        return (len(recent) == months and (recent["状態"] == "評価に使用").all()
                and all(rules.rank_order(r) >= rules.rank_order(condition.閾値) for r in recent["ランク"]))
    raise ValueError(f"未対応の抽出条件です: {condition.条件}")


def _extract(rules: Rules, persons: pd.DataFrame, person_detail: pd.DataFrame,
             review: list[dict]) -> dict[str, pd.DataFrame]:
    """抽出条件は、同じ抽出区分の中ではどれか1つに当てはまれば抽出する(OR)。"""
    avg_col = next(c for c in persons.columns if c.endswith("ヶ月平均スコア"))
    result = {}
    for category, conditions in rules.extractions.groupby("抽出区分", sort=False):
        rows = []
        for _, person in persons.iterrows():
            if person["判定"] == "対象外":
                continue
            history = person_detail[(person_detail["社員ID"] == person["社員ID"])
                                    & (person_detail["役職"] == person["役職"])]
            hit = [c for c in conditions.itertuples() if _matches(rules, c, person, history, avg_col)]
            if not hit:
                continue
            reasons = " / ".join(c.説明 for c in hit)
            if person["判定"] == "通常":
                rows.append({**person[["社員ID", "氏名", "役職", "担当", "担当名", "当月スコア", "当月ランク",
                                       avg_col]].to_dict(), "該当条件": reasons})
            else:
                review.append({"区分": "抽出保留", "対象種別": "対象者", "対象ID": person["社員ID"],
                               "名称": person["氏名"], "年月": "", "ルールID": "",
                               "内容": f"{category}の条件に該当({reasons})。判定が「{person['判定']}」のため確認後に抽出を判断"})
        result[category] = pd.DataFrame(rows, columns=["社員ID", "氏名", "役職", "担当", "担当名", "当月スコア",
                                                       "当月ランク", avg_col, "該当条件"])
    return result


def _percentiles(facilities: pd.DataFrame, detail: pd.DataFrame, target_month: pd.Period) -> pd.DataFrame:
    """「通常」判定の事業所について、スコアと各指標のパーセンタイルを出す。"""
    normal = facilities[facilities["判定"] == "通常"]
    avg_col = next(c for c in facilities.columns if c.endswith("ヶ月平均スコア"))
    points = [0.1, 0.25, 0.5, 0.75, 0.9]
    labels = ["P10", "P25", "P50(中央値)", "P75", "P90"]
    rows = []

    def add(group: str, item: str, values: pd.Series) -> None:
        values = values.dropna()
        if values.empty:
            return
        q = values.quantile(points)
        rows.append({"区分": group, "項目": item, "件数": len(values), **dict(zip(labels, q.round(1))),
                     "平均": round(values.mean(), 1)})

    add("全事業所", "当月スコア", normal["当月スコア"])
    add("全事業所", avg_col, normal[avg_col])
    for kind, group in normal.groupby("事業種別", sort=False):
        add(kind, "当月スコア", group["当月スコア"])
        current = detail[(detail["事業所ID"].isin(group["事業所ID"])) & (detail["年月"] == target_month)]
        for metric, values in current.groupby("指標", sort=False):
            add(kind, f"当月{metric}", values["実績値"])
    return pd.DataFrame(rows)
