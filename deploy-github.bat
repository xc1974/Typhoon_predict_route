@echo off
echo 准备部署到 GitHub Pages...
echo.

echo 正在备份本地版本...
if exist index.html (
    if not exist index-local.html (
        copy index.html index-local.html
        echo 已备份 index.html 为 index-local.html
    )
)

echo 正在切换到 GitHub Pages 版本...
if exist index-github.html (
    copy index-github.html index.html
    echo 已切换到 GitHub Pages 版本
) else (
    echo 错误: 找不到 index-github.html 文件
    pause
    exit /b 1
)

echo.
echo 正在提交更改到 Git...
git add .
git commit -m "Deploy to GitHub Pages"

echo.
echo 正在推送到 GitHub...
git push origin main

echo.
echo 部署完成！
echo 请访问: https://YOUR_USERNAME.github.io/typhoon-tracker/
echo.
echo 注意: 请将 YOUR_USERNAME 替换为你的 GitHub 用户名
echo.

pause
