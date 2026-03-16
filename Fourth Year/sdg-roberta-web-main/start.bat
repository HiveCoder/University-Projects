source venv/bin/activate@echo off
echo ==============================
echo SDG-ANALYSIS LAUNCHER
echo ==============================

:: Step 1: Check if venv exists
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
)

:: Step 2: Activate venv
call venv\Scripts\activate.bat

:: Step 3: Install Python packages if not already installed
echo Installing Python dependencies...
pip install -r requirements.txt

:: Step 4: Start Flask server in a new terminal
start cmd /k "cd /d %~dp0 && call venv\Scripts\activate.bat && python app.py"

:: Step 5: Move to the frontend directory and start Node.js app
echo Starting Web App...
cd web_app
call npm install
start cmd /k "npm run dev"

@echo off
echo Checking if the app is running at http://localhost:3000...

:waitloop
powershell -Command ^
  "try { $r = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"

if errorlevel 1 (
    timeout /t 1 > nul
    goto waitloop
)

:: Open the app in the default browser
start http://localhost:3000

echo ==============================
echo The app is now running at http://localhost:3000
echo ==============================
pause


echo ==============================
echo Both backend and frontend should be running.
echo ==============================
pause
