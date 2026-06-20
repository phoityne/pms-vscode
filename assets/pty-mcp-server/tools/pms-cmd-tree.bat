@echo off
chcp 65001 > nul
rem usage: pms-cmd-tree.bat <path> [type(dir|all)]
rem Note: depth is not supported on Windows.
rem Note: <path> must be located under ROOT_DIR (one level above this script).

setlocal
rem ROOT_DIR is auto-resolved to one level above this script.
rem To override, uncomment the next line and set your path.
rem set "ROOT_DIR=C:\path\to\work"
if not defined ROOT_DIR (for %%R in ("%~dp0..") do set "ROOT_DIR=%%~fR")

set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%ROOT_DIR%"
for %%A in ("%TARGET%") do set "TARGET_FULL=%%~fA"

rem Verify TARGET_FULL is under ROOT_DIR (prefix match, case-insensitive).
echo %TARGET_FULL%| findstr /I /B /C:"%ROOT_DIR%" >nul
if errorlevel 1 (
  echo Error: target path is outside ROOT_DIR: %TARGET_FULL% 1>&2
  echo Error: ROOT_DIR is: %ROOT_DIR% 1>&2
  exit /b 1
)

set "TYPE_ARG=%~2"
if "%TYPE_ARG%"=="" set "TYPE_ARG=all"

if /I "%TYPE_ARG%"=="dir" (
  tree "%TARGET_FULL%" /A
) else (
  tree "%TARGET_FULL%" /F /A
)
endlocal
