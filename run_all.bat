@echo off
REM Frontend와 Whisper 서버를 모두 실행하는 배치 파일
REM 두 개의 창에서 각각 실행됩니다

echo ========================================
echo Frontend 및 Whisper 서버 시작
echo ========================================
echo.

REM 가상환경 활성화
echo 가상환경 활성화 중...
call D:\AI_Project\venv\Scripts\activate.bat

if %ERRORLEVEL% NEQ 0 (
    echo 오류: 가상환경 활성화에 실패했습니다.
    pause
    exit /b 1
)

REM Frontend 실행 (새 창)
echo Frontend 서버를 새 창에서 시작합니다...
cd /d D:\AI_Project\SpeakingToText\frontend
if not exist "node_modules" (
    echo node_modules가 없습니다. 패키지를 설치합니다...
    call npm install
)
start "Frontend Server" cmd /k "cd /d D:\AI_Project\SpeakingToText\frontend && D:\AI_Project\venv\Scripts\activate.bat && npm run dev"

REM 잠시 대기
timeout /t 2 /nobreak >nul

REM Whisper 서버 실행 (새 창)
echo Whisper 서버를 새 창에서 시작합니다...
cd /d D:\AI_Project\SpeakingToText
python -c "import whisper" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Whisper 패키지가 설치되지 않았습니다. 패키지를 설치합니다...
    pip install -r scripts\requirements_whisper.txt
)
start "Whisper Server" cmd /k "cd /d D:\AI_Project\SpeakingToText && D:\AI_Project\venv\Scripts\activate.bat && python scripts\whisper_server.py"

echo.
echo 두 서버가 별도의 창에서 실행되었습니다.
echo.
echo Frontend: http://localhost:5173
echo Whisper Server: http://localhost:8000
echo.
pause

