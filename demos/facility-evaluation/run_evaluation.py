"""事業所評価を算出して Excel に出力する。

    python run_evaluation.py --month 2026-09
    python run_evaluation.py --month 2026-09 --data data/2026-09 --rules rules/評価ルール.xlsx
"""

import argparse
import sys
from pathlib import Path

import pandas as pd

from evaluator.engine import evaluate
from evaluator.loader import InputError, load_inputs
from evaluator.report import write_report
from evaluator.rules import load_rules

BASE_DIR = Path(__file__).parent


def main() -> int:
    parser = argparse.ArgumentParser(description="事業所評価の自動算出")
    parser.add_argument("--month", required=True, help="評価対象月(YYYY-MM)")
    parser.add_argument("--data", default=BASE_DIR / "data" / "sample", type=Path, help="入力CSVのフォルダ")
    parser.add_argument("--rules", default=BASE_DIR / "rules" / "評価ルール.xlsx", type=Path, help="評価ルールのExcel")
    parser.add_argument("--out", default=BASE_DIR / "output", type=Path, help="出力先フォルダ")
    args = parser.parse_args()

    try:
        month = pd.Period(args.month, freq="M")
        rules = load_rules(args.rules)
        data = load_inputs(args.data)
        result = evaluate(data, rules, month)
        path = write_report(result, data, rules, args.out / f"評価結果_{month}.xlsx")
    except InputError as e:
        print(f"[エラー] {e}", file=sys.stderr)
        return 1

    print(f"評価対象月: {month}(期間 {result.period[0]} 〜 {result.period[-1]})")
    print(f"事業所: {len(result.facilities)}件 / 対象者: {len(result.persons)}名")
    for name, df in result.extracted.items():
        print(f"{name}: {len(df)}名")
    print(f"要確認: {len(result.review)}件")
    print(f"出力: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
