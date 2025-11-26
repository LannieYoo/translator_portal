@echo off
REM Batch file to run both Frontend and Whisper server
REM Each server runs in a separate window

echo ========================================
echo Starting Frontend and Whisper Server
echo ========================================
echo.

REM Activate virtual environment
echo Activating virtual environment...
call D:\AI_Project\venv\Scripts\activate.bat

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Start Frontend (new window)
echo Starting Frontend server in a new window...
cd /d D:\AI_Project\PortalTranslator\frontend
if not exist "node_modules" (
    echo node_modules not found. Installing packages...
    call npm install
)
start "Frontend Server" cmd /k "cd /d D:\AI_Project\PortalTranslator\frontend && D:\AI_Project\venv\Scripts\activate.bat && npm run dev"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Whisper server (new window)
echo Starting Whisper server in a new window...
cd /d D:\AI_Project\PortalTranslator
python -c "import whisper" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Whisper package not installed. Installing packages...
    pip install -r scripts\requirements_whisper.txt
)
start "Whisper Server" cmd /k "cd /d D:\AI_Project\PortalTranslator && D:\AI_Project\venv\Scripts\activate.bat && python scripts\whisper_server.py"

echo.
echo Both servers are running in separate windows.
echo.
echo Frontend: http://localhost:3000
echo Whisper Server: http://localhost:8001
echo.
pause

