@echo off
setlocal
cd /d "%~dp0"
title Culinary Blog - Khoi dong
echo ===============================================
echo          CULINARY BLOG - BAT DAU CHAY
echo ===============================================
echo.
echo Hay dam bao Docker Desktop da duoc cai tren may.
echo Script se tu mo Docker Desktop neu chuong trinh chua chay.
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-portable.ps1"
if errorlevel 1 (
  echo.
  echo Khoi dong that bai. Hay chup man hinh loi va gui cho nhom.
  pause
  exit /b 1
)
echo.
echo Website da san sang tai http://localhost:3000
pause
