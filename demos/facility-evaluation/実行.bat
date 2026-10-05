@echo off
chcp 65001 > nul
cd /d %~dp0
set /p MONTH="評価対象月を入力してください (例: 2026-09): "
python run_evaluation.py --month %MONTH%
pause
