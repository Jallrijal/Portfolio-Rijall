@echo off
cd /d "%~dp0"
echo Membuka http://localhost:5000 ...
start "" http://localhost:5000
python -m http.server 5000 || npx --yes http-server -p 5000
