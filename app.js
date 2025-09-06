// 台风路径预测系统主应用
class TyphoonTracker {
    constructor() {
        this.map = null;
        this.currentApi = 'hko';
        this.typhoonData = {};
        this.pathLayers = {};
        this.markers = {};
        this.isLoading = false;
        this.apiService = new TyphoonApiService();
        
        this.init();
    }

    // 初始化应用
    init() {
        this.initMap();
        this.bindEvents();
        this.loadInitialData();
    }

    // 初始化地图
    initMap() {
        // 创建地图，以香港为中心
        this.map = L.map('map', {
            center: [22.3193, 114.1694], // 香港坐标
            zoom: 8,
            zoomControl: true
        });

        // 添加多种地图图层选项
        const baseLayers = {
            '标准地图': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }),
            '卫星图像': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                maxZoom: 18
            }),
            '地形图': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenTopoMap contributors',
                maxZoom: 17
            })
        };

        // 添加默认图层
        baseLayers['标准地图'].addTo(this.map);
        
        // 添加图层控制
        L.control.layers(baseLayers).addTo(this.map);

        // 添加香港边界标记
        this.addHongKongBoundary();
    }

    // 添加香港边界
    addHongKongBoundary() {
        const hongKongBounds = [
            [22.15, 113.8],
            [22.15, 114.4],
            [22.6, 114.4],
            [22.6, 113.8]
        ];

        L.rectangle(hongKongBounds, {
            color: '#e74c3c',
            weight: 2,
            fillColor: '#e74c3c',
            fillOpacity: 0.1
        }).addTo(this.map).bindPopup('香港特别行政区');
    }

    // 绑定事件
    bindEvents() {
        // API选择器
        document.querySelectorAll('.api-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectApi(e.currentTarget.dataset.api);
            });
        });

        // 刷新按钮
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // 清除按钮
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearPaths();
        });

        // 强度等级选择器
        document.querySelectorAll('.scale-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectIntensityLevel(e.currentTarget.dataset.level);
            });
        });

        // 自动刷新（每5分钟）
        setInterval(() => {
            if (!this.isLoading) {
                this.refreshData();
            }
        }, 300000);

        // 定期检查API状态（每30分钟）
        setInterval(() => {
            this.checkApiStatus();
        }, 1800000);
    }

    // 选择API
    selectApi(api) {
        document.querySelectorAll('.api-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-api="${api}"]`).classList.add('active');
        this.currentApi = api;
        this.refreshData();
    }

    // 加载初始数据
    async loadInitialData() {
        await this.refreshData();
    }

    // 刷新数据
    async refreshData() {
        if (this.isLoading) return;
        
        this.showLoading(true);
        this.isLoading = true;

        try {
            const apis = this.currentApi === 'all' ? ['hko', 'cma', 'jma'] : [this.currentApi];
            
            for (const api of apis) {
                await this.fetchTyphoonData(api);
            }
            
            this.updateTyphoonInfo();
        } catch (error) {
            console.error('数据加载失败:', error);
            this.showError('数据加载失败，请稍后重试');
        } finally {
            this.showLoading(false);
            this.isLoading = false;
        }
    }

    // 获取台风数据
    async fetchTyphoonData(api) {
        try {
            const data = await this.apiService.getTyphoonData(api);
            
            // 检查是否返回了有效数据
            if (data === null) {
                console.log(`${api} 当前没有台风数据`);
                this.updateApiStatus(api, true); // API可用但没有台风
                return;
            }
            
            this.typhoonData[api] = data;
            this.drawTyphoonPath(api, data);
            this.updateApiStatus(api, true);
        } catch (error) {
            console.error(`${api} 数据获取失败:`, error);
            this.updateApiStatus(api, false);
        }
    }


    // 绘制台风路径
    drawTyphoonPath(api, data) {
        // 清除现有路径
        if (this.pathLayers[api]) {
            this.map.removeLayer(this.pathLayers[api]);
        }

        const pathGroup = L.layerGroup();
        
        // 绘制历史路径
        if (data.path && data.path.length > 0) {
            const pathCoords = data.path.map(point => [point.lat, point.lng]);
            const pathColor = this.getPathColor(api);
            
            const pathLine = L.polyline(pathCoords, {
                color: pathColor,
                weight: 4,
                opacity: 0.8
            }).bindPopup(`${this.getApiName(api)} - 历史路径`);
            
            pathGroup.addLayer(pathLine);

            // 添加路径点标记
            data.path.forEach((point, index) => {
                const marker = L.circleMarker([point.lat, point.lng], {
                    radius: 6,
                    fillColor: pathColor,
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 0.8
                }).bindPopup(`
                    <strong>${this.getApiName(api)}</strong><br>
                    时间: ${new Date(point.time).toLocaleString('zh-CN')}<br>
                    强度: ${point.intensity}<br>
                    位置: ${point.lat.toFixed(2)}°N, ${point.lng.toFixed(2)}°E
                `);
                
                pathGroup.addLayer(marker);
            });
        }

        // 绘制预测路径
        if (data.forecast && data.forecast.length > 0) {
            const forecastCoords = data.forecast.map(point => [point.lat, point.lng]);
            const forecastColor = this.getPathColor(api);
            
            const forecastLine = L.polyline(forecastCoords, {
                color: forecastColor,
                weight: 4,
                opacity: 0.6,
                dashArray: '10, 5'
            }).bindPopup(`${this.getApiName(api)} - 预测路径`);
            
            pathGroup.addLayer(forecastLine);

            // 添加预测点标记
            data.forecast.forEach((point, index) => {
                const marker = L.circleMarker([point.lat, point.lng], {
                    radius: 4,
                    fillColor: forecastColor,
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 0.6
                }).bindPopup(`
                    <strong>${this.getApiName(api)} - 预测</strong><br>
                    时间: ${new Date(point.time).toLocaleString('zh-CN')}<br>
                    强度: ${point.intensity}<br>
                    位置: ${point.lat.toFixed(2)}°N, ${point.lng.toFixed(2)}°E
                `);
                
                pathGroup.addLayer(marker);
            });
        }

        // 添加当前台风位置标记
        if (data.path && data.path.length > 0) {
            const currentPoint = data.path[data.path.length - 1];
            
            // 添加台风影响范围圆圈
            this.addWindCircles(pathGroup, currentPoint, data.windSpeed);
            
            // 添加台风中心标记
            const currentMarker = L.marker([currentPoint.lat, currentPoint.lng], {
                icon: L.divIcon({
                    className: 'typhoon-marker',
                    html: this.getTyphoonIcon(data.intensity),
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                })
            }).bindPopup(`
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 10px 0; color: #e74c3c;">🌪️ ${data.name}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 12px;">
                        <div><strong>强度:</strong> ${data.intensity}</div>
                        <div><strong>气压:</strong> ${data.pressure} hPa</div>
                        <div><strong>风速:</strong> ${data.windSpeed} m/s</div>
                        <div><strong>数据源:</strong> ${this.getApiName(api)}</div>
                        <div><strong>时间:</strong> ${new Date(currentPoint.time).toLocaleString('zh-CN')}</div>
                        <div><strong>位置:</strong> ${currentPoint.lat.toFixed(2)}°N, ${currentPoint.lng.toFixed(2)}°E</div>
                    </div>
                </div>
            `);
            
            pathGroup.addLayer(currentMarker);
        }

        this.pathLayers[api] = pathGroup;
        this.map.addLayer(pathGroup);
        this.updateApiStatus(api, true);
    }

    // 获取路径颜色
    getPathColor(api) {
        const colors = {
            'hko': '#00d4ff',
            'cma': '#00ff88',
            'jma': '#ff6b35'
        };
        return colors[api] || '#9b59b6';
    }

    // 获取API名称
    getApiName(api) {
        const names = {
            'hko': '香港天文台',
            'cma': '中国气象局',
            'jma': '日本气象厅'
        };
        return names[api] || api;
    }

    // 获取台风图标
    getTyphoonIcon(intensity) {
        const icons = {
            '热带低压': '🌫️',
            '热带风暴': '🌪️',
            '强热带风暴': '🌀',
            '台风': '🌪️',
            '强台风': '🌀',
            '超强台风': '🌪️',
            'Tropical Depression': '🌫️',
            'Tropical Storm': '🌪️',
            'Severe Tropical Storm': '🌀',
            'Typhoon': '🌪️'
        };
        return icons[intensity] || '🌪️';
    }

    // 添加风力圈
    addWindCircles(pathGroup, point, windSpeed) {
        // 根据风速计算影响范围（公里）
        const windCircles = this.calculateWindCircles(windSpeed);
        
        windCircles.forEach((circle, index) => {
            const circleLayer = L.circle([point.lat, point.lng], {
                radius: circle.radius * 1000, // 转换为米
                color: circle.color,
                weight: 2,
                fillColor: circle.color,
                fillOpacity: circle.opacity,
                dashArray: circle.dashArray
            }).bindPopup(`
                <div style="text-align: center;">
                    <strong>${circle.label}</strong><br>
                    半径: ${circle.radius} km<br>
                    风速: ${circle.windSpeed} m/s
                </div>
            `);
            
            pathGroup.addLayer(circleLayer);
        });
    }

    // 计算风力圈
    calculateWindCircles(windSpeed) {
        const circles = [];
        
        // 根据风速等级计算不同的风力圈
        if (windSpeed >= 32) { // 台风及以上
            circles.push({
                radius: 200,
                color: '#ff4757',
                opacity: 0.12,
                dashArray: '8, 4',
                label: '强风圈',
                windSpeed: '≥32 m/s'
            });
            circles.push({
                radius: 100,
                color: '#ff6b35',
                opacity: 0.18,
                dashArray: '6, 3',
                label: '暴风圈',
                windSpeed: '≥25 m/s'
            });
        }
        
        if (windSpeed >= 17) { // 热带风暴及以上
            circles.push({
                radius: 50,
                color: '#00d4ff',
                opacity: 0.25,
                dashArray: '4, 2',
                label: '大风圈',
                windSpeed: '≥17 m/s'
            });
        }
        
        return circles;
    }

    // 更新API状态
    updateApiStatus(api, isOnline) {
        const statusIndicator = document.querySelector(`[data-api="${api}"] .status-indicator`);
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${isOnline ? 'status-online' : 'status-offline'}`;
        }
    }

    // 更新台风信息
    updateTyphoonInfo() {
        const infoDiv = document.getElementById('typhoonInfo');
        const detailsDiv = document.getElementById('typhoonDetails');
        const statsDiv = document.getElementById('typhoonStats');
        
        if (Object.keys(this.typhoonData).length === 0) {
            infoDiv.style.display = 'none';
            statsDiv.style.display = 'none';
            return;
        }

        const firstApi = Object.keys(this.typhoonData)[0];
        const data = this.typhoonData[firstApi];
        
        // 更新基本信息
        detailsDiv.innerHTML = `
            <div class="info-item">
                <span class="info-label">台风名称:</span>
                <span class="info-value">${data.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">当前强度:</span>
                <span class="info-value">${data.intensity}</span>
            </div>
            <div class="info-item">
                <span class="info-label">中心气压:</span>
                <span class="info-value">${data.pressure} hPa</span>
            </div>
            <div class="info-item">
                <span class="info-label">最大风速:</span>
                <span class="info-value">${data.windSpeed} m/s</span>
            </div>
            <div class="info-item">
                <span class="info-label">数据源:</span>
                <span class="info-value">${Object.keys(this.typhoonData).map(api => this.getApiName(api)).join(', ')}</span>
            </div>
            <div class="info-item">
                <span class="info-label">最后更新:</span>
                <span class="info-value">${new Date(data.lastUpdate).toLocaleString('zh-CN')}</span>
            </div>
        `;
        
        // 更新统计数据
        this.updateTyphoonStats(data);
        
        infoDiv.style.display = 'block';
        statsDiv.style.display = 'block';
    }

    // 更新台风统计数据
    updateTyphoonStats(data) {
        const currentIntensity = document.getElementById('currentIntensity');
        const maxWindSpeed = document.getElementById('maxWindSpeed');
        const minPressure = document.getElementById('minPressure');
        const movementSpeed = document.getElementById('movementSpeed');

        currentIntensity.textContent = data.intensity;
        maxWindSpeed.textContent = `${data.windSpeed} m/s`;
        minPressure.textContent = `${data.pressure} hPa`;
        
        // 计算移动速度（如果有路径数据）
        if (data.path && data.path.length >= 2) {
            const lastPoint = data.path[data.path.length - 1];
            const prevPoint = data.path[data.path.length - 2];
            const speed = this.calculateMovementSpeed(prevPoint, lastPoint);
            movementSpeed.textContent = `${speed} km/h`;
        } else {
            movementSpeed.textContent = '-';
        }
    }

    // 计算移动速度
    calculateMovementSpeed(point1, point2) {
        const R = 6371; // 地球半径（公里）
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLng = (point2.lng - point1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // 距离（公里）
        
        const timeDiff = (new Date(point2.time) - new Date(point1.time)) / (1000 * 60 * 60); // 时间差（小时）
        return Math.round(distance / timeDiff);
    }

    // 清除路径
    clearPaths() {
        Object.values(this.pathLayers).forEach(layer => {
            this.map.removeLayer(layer);
        });
        this.pathLayers = {};
        this.typhoonData = {};
        document.getElementById('typhoonInfo').style.display = 'none';
    }

    // 显示加载状态
    showLoading(show) {
        const loadingDiv = document.getElementById('loadingIndicator');
        loadingDiv.style.display = show ? 'block' : 'none';
    }

    // 选择强度等级
    selectIntensityLevel(level) {
        // 更新UI状态
        document.querySelectorAll('.scale-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        // 根据强度等级过滤显示
        this.filterByIntensity(parseInt(level));
    }

    // 根据强度过滤显示
    filterByIntensity(level) {
        const intensityLevels = {
            0: '热带低压',
            1: '热带风暴', 
            2: '强热带风暴',
            3: '台风',
            4: '强台风',
            5: '超强台风'
        };
        
        const targetIntensity = intensityLevels[level];
        
        // 重新绘制所有路径，只显示符合强度条件的
        Object.keys(this.typhoonData).forEach(api => {
            const data = this.typhoonData[api];
            if (this.matchesIntensityLevel(data.intensity, level)) {
                this.drawTyphoonPath(api, data);
            } else {
                // 隐藏不符合条件的路径
                if (this.pathLayers[api]) {
                    this.map.removeLayer(this.pathLayers[api]);
                }
            }
        });
    }

    // 检查强度是否匹配等级
    matchesIntensityLevel(intensity, level) {
        const intensityMap = {
            '热带低压': 0,
            '热带风暴': 1,
            '强热带风暴': 2,
            '台风': 3,
            '强台风': 4,
            '超强台风': 5,
            'Tropical Depression': 0,
            'Tropical Storm': 1,
            'Severe Tropical Storm': 2,
            'Typhoon': 3
        };
        
        const currentLevel = intensityMap[intensity] || 0;
        return currentLevel >= level;
    }

    // 检查API状态
    async checkApiStatus() {
        try {
            const status = await this.apiService.getApiStatus();
            console.log('API状态检查:', status);
            
            // 更新UI中的API状态指示器
            Object.keys(status).forEach(api => {
                const isAvailable = status[api].available;
                this.updateApiStatus(api, isAvailable);
            });
        } catch (error) {
            console.error('API状态检查失败:', error);
        }
    }

    // 显示错误信息
    showError(message) {
        // 创建现代化的错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4757, #ff3742);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
            z-index: 10000;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TyphoonTracker();
});
