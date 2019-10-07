@echo off
taskkill /f /im go-bindata.exe

start C:\\GoProject\\src\\hwu\\go-bindata.exe
"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"  --app=http://localhost:8000/aframe.html







