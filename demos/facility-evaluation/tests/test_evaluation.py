import shutil
from pathlib import Path

import pandas as pd
import pytest
from openpyxl import load_workbook

from evaluator.engine import compute_metric, evaluate
from evaluator.loader import InputData, InputError, load_inputs
from evaluator.rules import load_rules

BASE_DIR = Path(__file__).parent.parent
RULES = BASE_DIR / "rules" / "評価ルール.xlsx"
SAMPLE = BASE_DIR / "data" / "sample"
TARGET = pd.Period("2026-09", freq="M")
P = lambda s: pd.Period(s, freq="M")  # noqa: E731


@pytest.fixture(scope="module")
def rules():
    return load_rules(RULES)


@pytest.fixture(scope="module")
def sample_result(rules):
    return evaluate(load_inputs(SAMPLE), rules, TARGET)


def make_data(facilities, results, assignments, leaves=()):
    fac = pd.DataFrame(facilities, columns=["事業所ID", "事業所名", "事業種別", "エリア", "定員", "開設年月"])
    res = pd.DataFrame(results, columns=["事業所ID", "年月", "延べ利用者数", "算定単位数", "営業日数", "スタッフ数"])
    asg = pd.DataFrame(assignments, columns=["社員ID", "氏名", "役職", "事業所ID", "エリア", "着任年月", "離任年月"])
    lv = pd.DataFrame(list(leaves), columns=["社員ID", "休職開始年月", "休職終了年月"])
    return InputData(fac, res, asg, lv)


def day_service(fid="F001", opened="2015-04"):
    return (fid, "テスト事業所", "通所介護", "北エリア", 20, P(opened))


def months_of(fid, visits=400, units=340000, staff=6.0):
    return [(fid, m, visits, units, 25, staff) for m in pd.period_range("2026-04", "2026-09", freq="M")]


def manager(sid="S001", fid="F001", assigned="2020-04", left=pd.NaT):
    return (sid, "テスト 太郎", "事業所責任者", fid, "北エリア", P(assigned), left)


def test_稼働率は延べ利用者数を定員と営業日数で割る():
    actual = pd.Series({"延べ利用者数": 400, "算定単位数": 0, "営業日数": 25, "スタッフ数": 5})
    value, formula = compute_metric("稼働率", actual, 20)
    assert value == pytest.approx(80.0)
    assert "定員20" in formula and "営業日数25" in formula


def test_スタッフ数が0なら1人当たり指標は計算不可():
    actual = pd.Series({"延べ利用者数": 400, "算定単位数": 1000, "営業日数": 25, "スタッフ数": 0})
    value, _ = compute_metric("1人当たり単位数", actual, 20)
    assert value is None


def test_基準値どおりの実績ならスコア100(rules):
    # 稼働率80%(=400/(20*25))、1人当たり単位数58,000(=348,000/6) で既存の基準値ちょうど
    data = make_data([day_service()], months_of("F001", units=348000), [manager()])
    result = evaluate(data, rules, TARGET)
    fac = result.facilities.iloc[0]
    assert fac["当月スコア"] == pytest.approx(100.0)
    assert fac["当月ランク"] == "A"
    assert fac["判定"] == "通常"


def test_達成率は上限で打ち切る(rules):
    data = make_data([day_service()], months_of("F001", visits=2000), [manager()])
    detail = evaluate(data, rules, TARGET).facility_detail
    assert detail.loc[detail["指標"] == "稼働率", "達成率(%)"].max() == rules.achievement_cap


def test_開設12ヶ月未満は新規の基準値を使う(rules):
    data = make_data([day_service(opened="2026-01")], months_of("F001"), [manager(assigned="2026-01")])
    detail = evaluate(data, rules, TARGET).facility_detail
    assert set(detail["開設区分"]) == {"新規"}
    used_rows = set(detail["基準値表の行"])
    expected = set(rules.baselines.loc[(rules.baselines["事業種別"] == "通所介護")
                                       & (rules.baselines["開設区分"] == "新規"), "行"])
    assert used_rows == expected


def test_着任3ヶ月未満の責任者は対象外(rules):
    data = make_data([day_service()], months_of("F001"), [manager(assigned="2026-08")])
    person = evaluate(data, rules, TARGET).persons.iloc[0]
    assert person["判定"] == "対象外"
    assert "EX11" in person["適用ルール"]


def test_休職した月は評価から除く(rules):
    data = make_data([day_service()], months_of("F001"), [manager()],
                     leaves=[("S001", P("2026-05"), P("2026-06"))])
    result = evaluate(data, rules, TARGET)
    person = result.persons.iloc[0]
    assert person["評価月数"] == 4
    assert "2026-05" not in person["評価に使った月"]
    assert person["判定"] == "通常"


def test_実績が欠けた事業所は要確認一覧に載る(rules):
    results = [r for r in months_of("F001") if str(r[1]) != "2026-07"]
    result = evaluate(make_data([day_service()], results, [manager()]), rules, TARGET)
    assert result.facilities.iloc[0]["判定"] == "要確認"
    assert (result.review["ルールID"] == "EX02").any()


def test_同じ入力からは必ず同じ結果になる(rules):
    first = evaluate(load_inputs(SAMPLE), rules, TARGET)
    second = evaluate(load_inputs(SAMPLE), rules, TARGET)
    pd.testing.assert_frame_equal(first.facilities, second.facilities)
    pd.testing.assert_frame_equal(first.persons, second.persons)


def test_サンプルデータのシナリオどおりに抽出される(sample_result):
    improve = set(sample_result.extracted["業務改善報告書対象"]["社員ID"])
    retrain = set(sample_result.extracted["再教育対象"]["社員ID"])
    assert {"S004", "S012"} <= improve
    assert retrain == {"S012"}
    judgments = sample_result.facilities.set_index("事業所ID")["判定"]
    assert judgments["F007"] == "参考評価"
    assert judgments["F015"] == "要確認"
    assert judgments["F018"] == "要確認"


def test_ルール表の書き間違いは行番号付きで止まる(tmp_path):
    broken = tmp_path / "評価ルール.xlsx"
    shutil.copy(RULES, broken)
    wb = load_workbook(broken)
    wb["基準値"]["C3"] = "稼働りつ"
    wb.save(broken)
    with pytest.raises(InputError, match="3行目"):
        load_rules(broken)


def test_要確認の対象者は自動で抽出せず抽出保留にする(rules):
    # 実績が低い(稼働率40%)が、7月の実績が欠けているので事業所ごと要確認になる
    results = [r for r in months_of("F001", visits=200, units=170000) if str(r[1]) != "2026-07"]
    result = evaluate(make_data([day_service()], results, [manager()]), rules, TARGET)
    assert result.persons.iloc[0]["判定"] == "要確認"
    assert result.extracted["業務改善報告書対象"].empty
    assert (result.review["区分"] == "抽出保留").any()
