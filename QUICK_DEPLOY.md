# 🚀 快速部署到 GitHub Pages

## 一键部署步骤

### 1. 创建 GitHub 仓库
1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名输入: `typhoon-tracker`
4. 选择 "Public"（GitHub Pages 需要公开仓库）
5. 点击 "Create repository"

### 2. 上传代码
```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Typhoon Tracker"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/typhoon-tracker.git

# 推送到 GitHub
git push -u origin main
```

### 3. 启用 GitHub Pages
1. 进入仓库的 **Settings** 页面
2. 滚动到 **Pages** 部分
3. 在 **Source** 下选择 **GitHub Actions**
4. 等待自动部署完成

### 4. 访问应用
部署完成后，访问：
```
https://YOUR_USERNAME.github.io/typhoon-tracker/
```

## 🔄 更新应用

### 使用部署脚本（推荐）

**Windows 用户:**
```cmd
deploy-github.bat
```

**Linux/Mac 用户:**
```bash
./deploy-github.sh
```

### 手动更新
```bash
# 切换到 GitHub Pages 版本
cp index-github.html index.html

# 提交更改
git add .
git commit -m "Update typhoon tracker"
git push origin main
```

## 📁 文件说明

- `index.html` - 主页面（部署时使用）
- `index-github.html` - GitHub Pages 专用版本
- `index-local.html` - 本地开发版本（自动备份）
- `api-service-github.js` - GitHub Pages API 服务
- `api-service.js` - 本地开发 API 服务

## 🛠️ 自定义配置

### 修改仓库名
如果使用不同的仓库名，需要更新：
1. `package.json` 中的 `homepage` 字段
2. `index-github.html` 中的 GitHub 链接

### 添加自定义域名
1. 在仓库根目录创建 `CNAME` 文件
2. 添加你的域名：
   ```
   your-domain.com
   ```

## 🚨 常见问题

### 1. 页面显示空白
- 检查浏览器控制台错误
- 确认所有文件都已上传
- 检查 GitHub Actions 部署状态

### 2. API 请求失败
- GitHub Pages 使用 HTTPS，确保 API 支持
- 使用公共代理服务解决 CORS 问题

### 3. 样式不显示
- 检查 CSS 文件路径
- 确认外部 CDN 链接可访问

## 📊 部署状态检查

1. 进入仓库的 **Actions** 页面
2. 查看最新的部署日志
3. 确认部署成功

## 🎉 完成！

部署完成后，你的台风预测系统将在 GitHub Pages 上运行，用户可以：

- 🌐 在线访问，无需安装
- 📱 移动端友好
- 🔄 自动更新
- 🌪️ 实时台风数据

---

**提示**: 首次部署可能需要几分钟时间，请耐心等待。

