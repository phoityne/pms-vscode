@echo off
chcp 65001 > nul
rem usage: pms-cmd-copy.bat <src> <dst>
rem Equivalent to "cp -pr <src> <dst>".
rem - If src is a directory and dst is an existing directory,
rem   src is copied into dst as dst\<basename of src> (like cp -pr).
rem - If src is a directory and dst does not exist,
rem   dst is created as the copy of src.
rem - If src is a file, it is copied to dst (overwritten if dst exists).
rem Note: both <src> and <dst> must be located under ROOT_DIR (one level above this script).

setlocal enabledelayedexpansion
rem ROOT_DIR is auto-resolved to one level above this script.
rem To override, uncomment the next line and set your path.
rem set "ROOT_DIR=C:\path\to\work"
for %%R in ("%~dp0..") do set "ROOT_DIR=%%~fR"

set "SRC=%~1"
set "DST=%~2"
for %%A in ("%SRC%") do set "SRC_FULL=%%~fA"
for %%A in ("%DST%") do set "DST_FULL=%%~fA"

rem Verify SRC_FULL is under ROOT_DIR (prefix match, case-insensitive).
echo !SRC_FULL!| findstr /I /B /C:"%ROOT_DIR%" >nul
if errorlevel 1 (
  echo Error: source path is outside ROOT_DIR: !SRC_FULL! 1>&2
  exit /b 1
)
rem Verify DST_FULL is under ROOT_DIR (prefix match, case-insensitive).
echo !DST_FULL!| findstr /I /B /C:"%ROOT_DIR%" >nul
if errorlevel 1 (
  echo Error: destination path is outside ROOT_DIR: !DST_FULL! 1>&2
  exit /b 1
)

if not exist "%SRC_FULL%" (
  echo Error: source not found: %SRC_FULL% 1>&2
  exit /b 1
)

if exist "%SRC_FULL%\" (
  rem src is a directory
  if exist "%DST_FULL%\" (
    rem dst is an existing directory -> copy as dst\<basename of src>
    for %%I in ("%SRC_FULL%") do set "SRC_NAME=%%~nxI"
    xcopy "%SRC_FULL%" "%DST_FULL%\!SRC_NAME!\" /E /I /H /K /Y
  ) else (
    rem dst does not exist (or is not a directory) -> create dst as the copy of src
    xcopy "%SRC_FULL%" "%DST_FULL%" /E /I /H /K /Y
  )
) else (
  rem src is a file
  copy /Y "%SRC_FULL%" "%DST_FULL%"
)
endlocal
