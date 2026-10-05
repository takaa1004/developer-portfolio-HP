"""評価ルール表(Excel)の読み込みとチェック。

ルールは担当者が Excel で編集する前提なので、読み込み時に書き間違いを検出して
「どのシートの何行目が悪いか」を分かる形で止める。
"""

import hashlib
from dataclasses import dataclass
from pathlib import Path

import pandas as pd

from .loader import InputError

METRICS = ["稼働率", "延べ利用者数", "算定単位数", "1人当たり単位数", "1人当たり利用者数"]
FACILITY_CONDITIONS = ["開設経過月数_未満", "欠損月数_以上", "稼働率_超過"]
PERSON_CONDITIONS = ["着任経過月数_未満", "休職月数_以上", "評価月数_未満"]
EXTRACT_CONDITIONS = ["平均スコア_未満", "当月ランク_以下", "連続ランク_以下"]
ACTIONS = ["対象外", "要確認", "参考評価"]


@dataclass
class Rules:
    period_months: int
    new_facility_months: int
    achievement_cap: float
    baselines: pd.DataFrame  # 「行」列に Excel 上の行番号を持つ(算出根拠に記録する)
    ranks: pd.DataFrame  # スコア下限の降順
    exceptions: pd.DataFrame
    extractions: pd.DataFrame
    source: dict

    def rank_of(self, score: float) -> str:
        if pd.isna(score):
            return ""
        for row in self.ranks.itertuples():
            if score >= row.スコア下限:
                return row.ランク
        return self.ranks.iloc[-1]["ランク"]

    def rank_order(self, rank: str) -> int:
        """ランクの序列(大きいほど低い)。"""
        return list(self.ranks["ランク"]).index(rank)


def _sheet(path: Path, name: str, columns: list[str]) -> pd.DataFrame:
    try:
        df = pd.read_excel(path, sheet_name=name, dtype=str).fillna("")
    except ValueError as e:
        raise InputError(f"評価ルール: シート「{name}」が見つかりません") from e
    missing = [c for c in columns if c not in df.columns]
    if missing:
        raise InputError(f"評価ルール「{name}」: 必須の列がありません: {', '.join(missing)}")
    df = df[columns].copy()
    df.insert(0, "行", df.index + 2)  # Excel 上の行番号(1行目は見出し)
    df = df[df[columns].apply(lambda r: r.str.strip().ne("").any(), axis=1)]  # 空行は無視
    return df.apply(lambda c: c.str.strip() if c.dtype != "int64" else c)


def _number(df: pd.DataFrame, sheet: str, column: str) -> pd.Series:
    values = pd.to_numeric(df[column], errors="coerce")
    bad = df.loc[values.isna(), "行"]
    if not bad.empty:
        raise InputError(f"評価ルール「{sheet}」{bad.iloc[0]}行目: 「{column}」が数値ではありません")
    return values


def _check_choice(df: pd.DataFrame, sheet: str, column: str, choices: list[str]) -> None:
    bad = df[~df[column].isin(choices)]
    if not bad.empty:
        row = bad.iloc[0]
        raise InputError(f"評価ルール「{sheet}」{row['行']}行目: 「{column}」の値「{row[column]}」は使えません"
                         f"(使える値: {' / '.join(choices)})")


def load_rules(path: Path) -> Rules:
    if not path.exists():
        raise InputError(f"評価ルールのファイルが見つかりません: {path}")

    settings = _sheet(path, "設定", ["項目", "値"])
    values = dict(zip(settings["項目"], pd.to_numeric(settings["値"], errors="coerce")))
    for key in ["評価期間(月数)", "新規判定(開設後の月数)", "達成率の上限(%)"]:
        if pd.isna(values.get(key)):
            raise InputError(f"評価ルール「設定」: 「{key}」が未設定か数値ではありません")

    base = _sheet(path, "基準値", ["事業種別", "開設区分", "指標", "基準値", "重み"])
    _check_choice(base, "基準値", "開設区分", ["既存", "新規"])
    _check_choice(base, "基準値", "指標", METRICS)
    base["基準値"] = _number(base, "基準値", "基準値")
    base["重み"] = _number(base, "基準値", "重み")
    dup = base[base.duplicated(["事業種別", "開設区分", "指標"], keep=False)]
    if not dup.empty:
        raise InputError(f"評価ルール「基準値」{', '.join(map(str, dup['行']))}行目: "
                         "同じ事業種別・開設区分・指標の行が重複しています")
    if (base["基準値"] <= 0).any():
        raise InputError(f"評価ルール「基準値」{base.loc[base['基準値'] <= 0, '行'].iloc[0]}行目: 基準値は正の数にしてください")

    ranks = _sheet(path, "評価ランク", ["ランク", "スコア下限"])
    ranks["スコア下限"] = _number(ranks, "評価ランク", "スコア下限")
    ranks = ranks.sort_values("スコア下限", ascending=False).reset_index(drop=True)

    exc = _sheet(path, "例外条件", ["ルールID", "対象", "条件", "閾値", "処理", "説明", "有効"])
    exc = exc[exc["有効"] == "○"]
    _check_choice(exc, "例外条件", "対象", ["事業所", "対象者"])
    _check_choice(exc, "例外条件", "条件", FACILITY_CONDITIONS + PERSON_CONDITIONS)
    _check_choice(exc, "例外条件", "処理", ACTIONS)
    exc["閾値"] = _number(exc, "例外条件", "閾値")

    ext = _sheet(path, "抽出条件", ["抽出区分", "条件", "閾値", "閾値2", "説明", "有効"])
    ext = ext[ext["有効"] == "○"]
    _check_choice(ext, "抽出条件", "条件", EXTRACT_CONDITIONS)
    for row in ext.itertuples():
        if row.条件 in ("当月ランク_以下", "連続ランク_以下") and row.閾値 not in list(ranks["ランク"]):
            raise InputError(f"評価ルール「抽出条件」{row.行}行目: 閾値「{row.閾値}」は評価ランクにありません")

    return Rules(
        period_months=int(values["評価期間(月数)"]),
        new_facility_months=int(values["新規判定(開設後の月数)"]),
        achievement_cap=float(values["達成率の上限(%)"]),
        baselines=base,
        ranks=ranks,
        exceptions=exc,
        extractions=ext,
        source={"ファイル": path.name, "行数": "-",
                "SHA-256(先頭16桁)": hashlib.sha256(path.read_bytes()).hexdigest()[:16]},
    )
