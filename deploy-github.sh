#!/bin/bash

echo "准备部署到 GitHub Pages..."
echo

echo "正在备份本地版本..."
if [ -f "index.html" ] && [ ! -f "index-local.html" ]; then
    cp index.html index-local.html
    echo "已备份 index.html 为 index-local.html"
fi

echo "正在切换到 GitHub Pages 版本..."
if [ -f "index-github.html" ]; then
    cp index-github.html index.html
    echo "已切换到 GitHub Pages 版本"
else
    echo "错误: 找不到 index-github.html 文件"
    exit 1
fi

echo
echo "正在提交更改到 Git..."
git add .
git commit -m "Deploy to GitHub Pages"

echo
echo "正在推送到 GitHub..."
git push origin main

echo
echo "部署完成！"
echo "请访问: https://YOUR_USERNAME.github.io/typhoon-tracker/"
echo
echo "注意: 请将 YOUR_USERNAME 替换为你的 GitHub 用户名"
echo
