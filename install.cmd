@echo off
rem Installs the forecast: the Python environment, the model files of the release and a test forecast.
rem   install.cmd              install and test
rem   install.cmd --service    also run it in the background (Task Scheduler; open the terminal as Administrator)
rem Details: SETUP.md
setlocal
cd /d "%~dp0"
where uv >nul 2>nul || goto :nouv
set PYTHONUTF8=1
uv sync --frozen --no-dev || exit /b 1
uv run --no-sync python -m ops.install %*
exit /b %errorlevel%

:nouv
echo This installer needs uv, the Python package manager: https://docs.astral.sh/uv/
echo Install it with
echo     powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
echo then open a new terminal and run install.cmd again.
exit /b 1
