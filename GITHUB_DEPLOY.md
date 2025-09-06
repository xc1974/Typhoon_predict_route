# GitHub Pages 部署指南

## 🚀 快速部署到 GitHub Pages

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建一个新仓库
2. 仓库名建议使用: `typhoon-tracker` 或 `typhoon-prediction`
3. 设置为公开仓库（GitHub Pages 需要）

### 2. 上传代码

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Typhoon Tracker System"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/typhoon-tracker.git

# 推送到 GitHub
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 滚动到 **Pages** 部分
3. 在 **Source** 下选择 **GitHub Actions**
4. 系统会自动检测到 `.github/workflows/deploy.yml` 文件

### 4. 重命名文件

将 `index-github.html` 重命名为 `index.html`：

```bash
# 备份原始文件
mv index.html index-local.html

# 使用 GitHub Pages 版本
mv index-github.html index.html
```

### 5. 提交更改

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push
```

## 🔧 配置说明

### GitHub Actions 工作流

系统使用 GitHub Actions 自动部署：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
```

### 文件结构

```
typhoon-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 配置
├── index.html                  # 主页面 (GitHub Pages 版本)
├── index-local.html            # 本地开发版本
├── app.js                      # 主应用逻辑
├── config.js                   # 配置文件
├── api-service-github.js       # GitHub Pages API 服务
├── api-service.js              # 本地开发 API 服务
├── server.js                   # 本地代理服务器
├── package.json                # Node.js 依赖
└── README.md                   # 说明文档
```

## 🌐 访问应用

部署完成后，你的应用将在以下地址可用：

```
https://YOUR_USERNAME.github.io/typhoon-tracker/
```

## 🔄 更新应用

每次推送代码到 `main` 分支时，GitHub Actions 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "Update typhoon tracker"
git push
```

## 🛠️ 自定义配置

### 修改仓库名

如果使用不同的仓库名，需要更新：

1. `package.json` 中的 `homepage` 字段
2. `index-github.html` 中的 GitHub 链接

### 自定义域名

1. 在仓库根目录创建 `CNAME` 文件
2. 添加你的域名：
   ```
   your-domain.com
   ```
3. 在域名服务商处配置 CNAME 记录

## 🚨 故障排除

### 常见问题

1. **页面显示空白**
   - 检查浏览器控制台错误
   - 确认所有文件都已上传
   - 检查 GitHub Actions 部署状态

2. **API 请求失败**
   - GitHub Pages 使用 HTTPS，确保 API 支持 HTTPS
   - 检查 CORS 设置
   - 使用公共代理服务

3. **样式不显示**
   - 检查 CSS 文件路径
   - 确认外部 CDN 链接可访问

4. **地图不显示**
   - 检查 Leaflet.js 加载
   - 确认网络连接正常

### 调试步骤

1. **检查部署状态**
   - 进入仓库的 **Actions** 页面
   - 查看最新的部署日志

2. **本地测试**
   ```bash
   # 使用 GitHub Pages 版本测试
   python -m http.server 8000
   # 访问 http://localhost:8000
   ```

3. **检查网络请求**
   - 打开浏览器开发者工具
   - 查看 Network 标签页
   - 检查 API 请求状态

## 📊 性能优化

### 1. 启用压缩
GitHub Pages 自动启用 Gzip 压缩

### 2. 使用 CDN
所有外部资源都使用 CDN：
- Leaflet.js
- 字体文件
- 图标库

### 3. 缓存策略
- 静态资源使用长期缓存
- API 数据使用短期缓存

## 🔒 安全考虑

### 1. API 密钥
- 不要在客户端代码中硬编码敏感信息
- 使用环境变量或配置文件

### 2. CORS 设置
- 使用公共代理服务避免 CORS 问题
- 考虑使用 GitHub Pages 的服务器端功能

### 3. 内容安全策略
可以在 HTML 中添加 CSP 头：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://unpkg.com; 
               style-src 'self' 'unsafe-inline' https://unpkg.com;">
```

## 📈 监控和分析

### 1. GitHub 统计
- 查看仓库的访问统计
- 监控部署状态

### 2. 用户分析
可以集成 Google Analytics：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎉 完成！

部署完成后，你的台风预测系统将在 GitHub Pages 上运行，用户可以：

- 查看实时台风数据
- 使用交互式地图
- 获取多数据源预测
- 享受现代化的用户界面

---

**注意**: GitHub Pages 是静态托管服务，不支持服务器端功能。所有 API 请求都通过客户端和公共代理服务完成。
