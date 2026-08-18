@echo off
setlocal
cd /d "%~dp0"
set "NODE_BIN=C:\Users\yueli\AppData\Local\OpenAI\Codex\runtimes\cua_node\2f053e67fec2d258\bin"
set "NPM=%NODE_BIN%\npm.cmd"
if exist "%NPM%" (
  set "PATH=%NODE_BIN%;%PATH%"
  call "%NPM%" run dev -- --host 127.0.0.1 --port 5174
) else (
  call npm run dev -- --host 127.0.0.1 --port 5174
)
endlocal
