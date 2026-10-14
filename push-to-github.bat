@echo off
cls
echo ========================================================
echo   ResumePilot AI - GitHub 1-Click Upload Tool
echo ========================================================
echo.
echo Target Repository: https://github.com/kaswanmanish859-collab/ResumePilot-AI.git
echo.
echo Choose your authentication method:
echo   [1] Normal Browser Login (Click Authorize in Browser popup)
echo   [2] GitHub Personal Access Token (Direct & 100%% Guaranteed)
echo.
echo   * NOTE FOR BRAVE BROWSER: If Brave is your default browser, Brave Shields
echo     may block the login callback. Choose Option 2, or turn Brave Shields OFF!
echo.
set /p METHOD="Select [1 or 2] (Default is 1): "

echo.
echo [1/3] Preparing Git files...
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/kaswanmanish859-collab/ResumePilot-AI.git
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "fix(vercel): instant PDF parsing, safe JSON client, and production routes" 2>nul
"C:\Program Files\Git\cmd\git.exe" branch -M main

if "%METHOD%"=="2" (
    echo.
    echo Get your token from: https://github.com/settings/tokens (classic, tick 'repo')
    set /p GITHUB_TOKEN="Paste your GitHub Token: "
    echo.
    echo [2/3] Uploading directly with Token...
    "C:\Program Files\Git\cmd\git.exe" push https://%GITHUB_TOKEN%@github.com/kaswanmanish859-collab/ResumePilot-AI.git main --force
) else (
    echo.
    echo [2/3] Connecting to GitHub...
    echo.
    echo *** IMPORTANT: If a browser window opens, please click "Authorize" or "Sign in" ***
    echo.
    "C:\Program Files\Git\cmd\git.exe" push -u origin main --force
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All files and folders uploaded to GitHub!
    echo   Now refresh GitHub: https://github.com/kaswanmanish859-collab/ResumePilot-AI
    echo   Vercel will now automatically deploy successfully!
    echo ========================================================
) else (
    echo.
    echo [!] Push failed or cancelled.
    echo If browser login fails, choose Option 2 and use a GitHub Token from https://github.com/settings/tokens
)

pause
