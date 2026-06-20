@echo off
chcp 65001 > nul
rem usage: pms-cmd-move.bat <src> <dst>
rem Note: both <src> and <dst> must be located under ROOT_DIR (one level above this script).

setlocal
rem ROOT_DIR is auto-resolved to one level above this script.
rem To override, uncomment the next line and set your path.
rem set "ROOT_DIR=C:\path\to\work"
if not defined ROOT_DIR (for %%R in ("%~dp0..") do set "ROOT_DIR=%%~fR")

for %%A in ("%~1") do set "SRC_FULL=%%~fA"
for %%A in ("%~2") do set "DST_FULL=%%~fA"

rem Verify SRC_FULL is under ROOT_DIR (prefix match, case-insensitive).
echo %SRC_FULL%| findstr /I /B /C:"%ROOT_DIR%" >nul
if errorlevel 1 (
  echo Error: source path is outside ROOT_DIR: %SRC_FULL% 1>&2
  exit /b 1
)
rem Verify DST_FULL is under ROOT_DIR (prefix match, case-insensitive).
echo %DST_FULL%| findstr /I /B /C:"%ROOT_DIR%" >nul
if errorlevel 1 (
  echo Error: destination path is outside ROOT_DIR: %DST_FULL% 1>&2
  exit /b 1
)

move "%SRC_FULL%" "%DST_FULL%"
endlocal
