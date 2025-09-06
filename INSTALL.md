# 台风路径预测系统 - 安装指南

## 📋 系统要求

- **Node.js**: 版本 14.0.0 或更高
- **npm**: 版本 6.0.0 或更高
- **浏览器**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **操作系统**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)

## 🚀 快速安装

### 1. 下载项目
```bash
git clone https://github.com/your-username/typhoon-tracker.git
cd typhoon-tracker
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动应用
```bash
npm start
```

### 4. 访问应用
打开浏览器访问: `http://localhost:3000`

## 🔧 详细安装步骤

### Windows 用户

1. **安装 Node.js**
   - 访问 [Node.js官网](https://nodejs.org/)
   - 下载 LTS 版本 (推荐 18.x)
   - 运行安装程序，按默认设置安装

2. **验证安装**
   ```cmd
   node --version
   npm --version
   ```

3. **运行项目**
   - 双击 `start.bat` 文件
   - 或在命令提示符中运行:
     ```cmd
     npm install
     npm start
     ```

### macOS 用户

1. **安装 Node.js**
   ```bash
   # 使用 Homebrew
   brew install node
   
   # 或从官网下载安装包
   # https://nodejs.org/
   ```

2. **运行项目**
   ```bash
   npm install
   npm start
   ```

### Linux 用户

1. **安装 Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **运行项目**
   ```bash
   npm install
   npm start
   ```

## 🐳 Docker 部署

### 使用 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

### 构建和运行
```bash
# 构建镜像
docker build -t typhoon-tracker .

# 运行容器
docker run -p 3000:3000 typhoon-tracker
```

## 🔧 配置说明

### 环境变量
创建 `.env` 文件:
```env
PORT=3000
NODE_ENV=production
API_TIMEOUT=10000
CACHE_DURATION=300000
```

### 代理服务器配置
在 `server.js` 中可以配置:
- 端口号
- CORS 设置
- API 超时时间
- 缓存策略

## 🚨 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :3000
   
   # 杀死进程
   kill -9 <PID>
   ```

2. **依赖安装失败**
   ```bash
   # 清除缓存
   npm cache clean --force
   
   # 删除 node_modules 重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API 请求失败**
   - 检查网络连接
   - 确认代理服务器正在运行
   - 查看浏览器控制台错误信息

4. **CORS 错误**
   - 确保使用代理服务器 (localhost:3000)
   - 不要直接打开 index.html 文件

### 日志查看
```bash
# 查看应用日志
npm start

# 开发模式 (自动重启)
npm run dev
```

## 📊 性能优化

### 生产环境优化
1. **启用压缩**
   ```javascript
   app.use(compression());
   ```

2. **设置缓存**
   ```javascript
   app.use(express.static('.', {
     maxAge: '1d'
   }));
   ```

3. **使用 PM2 进程管理**
   ```bash
   npm install -g pm2
   pm2 start server.js --name typhoon-tracker
   ```

## 🔒 安全考虑

1. **API 密钥管理**
   - 不要在客户端代码中硬编码 API 密钥
   - 使用环境变量存储敏感信息

2. **CORS 配置**
   - 在生产环境中限制允许的域名
   - 避免使用通配符 `*`

3. **速率限制**
   - 实施 API 请求频率限制
   - 防止滥用和 DDoS 攻击

## 📞 技术支持

如果遇到问题，请:
1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 提交新的 Issue 并附上错误日志

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 集成官方气象 API
- 现代化界面设计
- 代理服务器支持

---

**注意**: 本系统需要稳定的网络连接以获取实时气象数据。在某些地区可能需要配置代理服务器。
