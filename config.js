// 台风预测系统配置文件
const TyphoonConfig = {
    // API配置
    apis: {
        hko: {
            name: '香港天文台',
            baseUrl: 'https://www.weather.gov.hk',
            endpoints: {
                current: '/en/wxinfo/currwx/tc_gis.htm',
                forecast: '/en/wxinfo/currwx/tc_gis.htm'
            },
            enabled: true,
            color: '#e74c3c',
            icon: '🇭🇰'
        },
        cma: {
            name: '中国气象局',
            baseUrl: 'https://tcdata.typhoon.org.cn',
            endpoints: {
                current: '/en/ybjdpd.html',
                forecast: '/en/ybjdpd.html'
            },
            enabled: true,
            color: '#3498db',
            icon: '🇨🇳'
        },
        jma: {
            name: '日本气象厅',
            baseUrl: 'https://www.jma.go.jp',
            endpoints: {
                current: '/en/typhoon/',
                forecast: '/en/typhoon/'
            },
            enabled: true,
            color: '#f39c12',
            icon: '🇯🇵'
        }
    },

    // 地图配置
    map: {
        center: [22.3193, 114.1694], // 香港坐标
        zoom: 8,
        minZoom: 6,
        maxZoom: 18
    },

    // 台风强度等级配置
    intensityLevels: {
        '热带低压': { min: 0, max: 17, color: '#95a5a6', symbol: '○' },
        '热带风暴': { min: 17, max: 24, color: '#f39c12', symbol: '◐' },
        '强热带风暴': { min: 24, max: 32, color: '#e67e22', symbol: '◑' },
        '台风': { min: 32, max: 41, color: '#e74c3c', symbol: '●' },
        '强台风': { min: 41, max: 50, color: '#c0392b', symbol: '●' },
        '超强台风': { min: 50, max: 100, color: '#8e44ad', symbol: '●' }
    },

    // 更新间隔（毫秒）
    updateInterval: 300000, // 5分钟

    // 路径显示配置
    path: {
        history: {
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
        },
        forecast: {
            weight: 4,
            opacity: 0.6,
            dashArray: '10, 5'
        }
    },

    // 标记配置
    markers: {
        current: {
            radius: 8,
            fillOpacity: 0.8,
            weight: 2
        },
        forecast: {
            radius: 6,
            fillOpacity: 0.6,
            weight: 2
        }
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TyphoonConfig;
}
