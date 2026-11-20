@echo off
setlocal
cd /d "%~dp0"
title Culinary Blog - Dung chuong trinh
echo Dang dung Culinary Blog va giu nguyen du lieu...
docker compose down
if errorlevel 1 (
  echo Khong dung duoc chuong trinh. Kiem tra Docker Desktop.
  pause
  exit /b 1
)
echo Da dung chuong trinh. Database va du lieu van duoc giu nguyen.
pause
