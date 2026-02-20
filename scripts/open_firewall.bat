@echo off
:: Realtime Dashboard Firewall Port Opener
:: This script must be run as Administrator to add firewall rules.

echo [Step 1] Checking for Administrator privileges...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [+] Administrator privileges confirmed.
) else (
    echo [!] ERROR: Please run this script as Administrator!
    echo [!] Right-click the file and select 'Run as administrator'.
    pause
    exit /b 1
)

echo [Step 2] Adding firewall rule for Frontend (Port 3000)...
netsh advfirewall firewall add rule name="RealtimeDashboard_Frontend" dir=in action=allow protocol=TCP localport=3000

echo [Step 3] Adding firewall rule for Backend (Port 8000)...
netsh advfirewall firewall add rule name="RealtimeDashboard_Backend" dir=in action=allow protocol=TCP localport=8000

echo.
echo [+] All rules added successfully!
echo [+] Now you can access the dashboard from your mobile device.
echo.
pause
