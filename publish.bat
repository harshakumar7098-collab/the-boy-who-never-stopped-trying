@echo off
setlocal
cd /d "%~dp0"

set "GIT=git"
where git >nul 2>nul
if errorlevel 1 (
  for /d %%G in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
    if exist "%%G\resources\app\git\mingw64\bin\git.exe" (
      set "GIT=%%G\resources\app\git\mingw64\bin\git.exe"
      set "GIT_EXEC_PATH=%%G\resources\app\git\mingw64\bin"
      set "PATH=%%G\resources\app\git\mingw64\bin;%%G\resources\app\git\cmd;%%G\resources\app\git\usr\bin;%PATH%"
    )
  )
)
if not exist "%GIT%" if "%GIT%"=="git" (
  echo Git was not found. Install Git for Windows or GitHub Desktop, then run this again.
  exit /b 1
)

set "MSG=%*"
if "%MSG%"=="" set "MSG=Update memoir website"

"%GIT%" add .
"%GIT%" diff --cached --quiet
if not errorlevel 1 (
  echo No changes to publish.
  exit /b 0
)

"%GIT%" commit -m "%MSG%"
if errorlevel 1 exit /b 1

"%GIT%" push
if errorlevel 1 exit /b 1

echo Published. GitHub Pages will update automatically.
