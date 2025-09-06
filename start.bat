@echo off
echo 启动台风路径预测系统...
echo.
echo 正在安装依赖...
call npm install
echo.
echo 正在启动代理服务器...
echo 请在浏览器中访问: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.
call npm start
pause
