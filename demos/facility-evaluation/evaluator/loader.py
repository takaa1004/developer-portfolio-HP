"""入力CSVの読み込みと妥当性チェック。"""

import hashlib
from dataclasses import dataclass, field
from pathlib import Path

import pandas as pd

# ファイル名と必須列。社内システムの出力形式が変わったらここを直す。
INPUT_FILES = {
    "facilities": ("事業所マスタ.csv", ["事業所ID", "事業所名", "事業種別", "エリア", "定員", "開設年月"]),
    "results": ("月次実績.csv", ["事業所ID", "年月", "延べ利用者数", "算定単位数", "営業日数", "スタッフ数"]),
    "assignments": ("着任情報.csv", ["社員ID", "氏名", "役職", "事業所ID", "エリア", "着任年月", "離任年月"]),
    "leaves": ("休職情報.csv", ["社員ID", "休職開始年月", "休職終了年月"]),
}


class InputError(Exception):
    """処理を続けられない入力の不備(ファイルがない、列が足りないなど)。"""


@dataclass
class InputData:
    facilities: pd.DataFrame
    results: pd.DataFrame
    assignments: pd.DataFrame
    leaves: pd.DataFrame
    files: list[dict] = field(default_factory=list)  # 実行ログ用(ファイル名・行数・ハッシュ)
    issues: list[dict] = field(default_factory=list)  # 処理は続けるが人の確認が必要な不備


def _read_csv(path: Path) -> pd.DataFrame:
    # 社内システムの出力は Shift-JIS が多いので、UTF-8 で読めなければ cp932 で読み直す
    for encoding in ("utf-8-sig", "cp932"):
        try:
            return pd.read_csv(path, dtype=str, keep_default_na=False, encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise InputError(f"{path.name}: 文字コードを判別できません(UTF-8 または Shift-JIS で保存してください)")


def _to_period(series: pd.Series, file: str, column: str) -> pd.Series:
    parsed = pd.to_datetime(series.str.strip(), format="%Y-%m", errors="coerce")
    bad = series[parsed.isna() & (series.str.strip() != "")]
    if not bad.empty:
        raise InputError(f"{file}: 「{column}」に YYYY-MM 形式でない値があります: {', '.join(bad.unique()[:5])}")
    return parsed.dt.to_period("M")


def _to_number(series: pd.Series, file: str, column: str) -> pd.Series:
    parsed = pd.to_numeric(series.str.replace(",", "").str.strip(), errors="coerce")
    bad = series[parsed.isna() & (series.str.strip() != "")]
    if not bad.empty:
        raise InputError(f"{file}: 「{column}」に数値でない値があります: {', '.join(bad.unique()[:5])}")
    return parsed


def load_inputs(data_dir: Path) -> InputData:
    frames, files = {}, []
    for key, (name, columns) in INPUT_FILES.items():
        path = data_dir / name
        if not path.exists():
            raise InputError(f"入力ファイルが見つかりません: {path}")
        df = _read_csv(path)
        missing = [c for c in columns if c not in df.columns]
        if missing:
            raise InputError(f"{name}: 必須の列がありません: {', '.join(missing)}")
        frames[key] = df[columns].copy()
        files.append({
            "ファイル": name,
            "行数": len(df),
            "SHA-256(先頭16桁)": hashlib.sha256(path.read_bytes()).hexdigest()[:16],
        })

    fac = frames["facilities"]
    fac["定員"] = _to_number(fac["定員"], "事業所マスタ.csv", "定員")
    fac["開設年月"] = _to_period(fac["開設年月"], "事業所マスタ.csv", "開設年月")

    res = frames["results"]
    res["年月"] = _to_period(res["年月"], "月次実績.csv", "年月")
    for col in ["延べ利用者数", "算定単位数", "営業日数", "スタッフ数"]:
        res[col] = _to_number(res[col], "月次実績.csv", col)

    asg = frames["assignments"]
    asg["着任年月"] = _to_period(asg["着任年月"], "着任情報.csv", "着任年月")
    asg["離任年月"] = _to_period(asg["離任年月"], "着任情報.csv", "離任年月")

    lv = frames["leaves"]
    lv["休職開始年月"] = _to_period(lv["休職開始年月"], "休職情報.csv", "休職開始年月")
    lv["休職終了年月"] = _to_period(lv["休職終了年月"], "休職情報.csv", "休職終了年月")

    data = InputData(fac, res, asg, lv, files)
    data.issues = validate(data)
    return data


def validate(data: InputData) -> list[dict]:
    """処理は止めずに「要確認」として人に回す不備を洗い出す。"""
    issues = []

    def add(target_type: str, target_id: str, month, message: str) -> None:
        issues.append({"区分": "データ不備", "対象種別": target_type, "対象ID": target_id,
                       "年月": str(month) if month is not None else "", "内容": message})

    fac, res = data.facilities, data.results

    for fid in fac.loc[fac["事業所ID"].duplicated(), "事業所ID"]:
        add("事業所", fid, None, "事業所マスタに同じ事業所IDが複数あります")
    for row in fac[(fac["事業種別"] == "通所介護") & fac["定員"].isna()].itertuples():
        add("事業所", row.事業所ID, None, "通所介護なのに定員が空欄です(稼働率を計算できません)")

    dup = res[res.duplicated(["事業所ID", "年月"], keep=False)]
    for (fid, month), _ in dup.groupby(["事業所ID", "年月"]):
        add("事業所", fid, month, "同じ月の実績が複数行あります(先頭の行を採用しました)")
    for fid in sorted(set(res["事業所ID"]) - set(fac["事業所ID"])):
        add("事業所", fid, None, "月次実績にあるが事業所マスタにない事業所IDです(評価から除外しました)")

    numeric = ["延べ利用者数", "算定単位数", "営業日数", "スタッフ数"]
    for row in res[res[numeric].isna().any(axis=1)].itertuples():
        add("事業所", row.事業所ID, row.年月, "実績に空欄があります")
    for row in res[(res[numeric] < 0).any(axis=1)].itertuples():
        add("事業所", row.事業所ID, row.年月, "実績にマイナスの値があります")
    for row in res[res["スタッフ数"] == 0].itertuples():
        add("事業所", row.事業所ID, row.年月, "スタッフ数が0です(1人当たりの指標を計算できません)")

    asg = data.assignments
    for row in asg[asg["離任年月"].notna() & (asg["離任年月"] < asg["着任年月"])].itertuples():
        add("対象者", row.社員ID, None, "離任年月が着任年月より前になっています")
    for sid in sorted(set(data.leaves["社員ID"]) - set(asg["社員ID"])):
        add("対象者", sid, None, "休職情報にあるが着任情報にない社員IDです")

    data.results = res.drop_duplicates(["事業所ID", "年月"], keep="first")
    return issues
