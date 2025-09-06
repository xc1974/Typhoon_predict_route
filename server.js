// 台风数据代理服务器
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 香港天文台API代理
app.get('/api/hko/weather', async (req, res) => {
    try {
        const { dataType, lang } = req.query;
        const url = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=${dataType}&lang=${lang}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('HKO API错误:', error);
        res.status(500).json({ error: 'HKO API请求失败' });
    }
});

// 中国气象局API代理
app.get('/api/cma/typhoon', async (req, res) => {
    try {
        const url = 'https://tcdata.typhoon.org.cn/api/typhoon/list';
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('CMA API错误:', error);
        res.status(500).json({ error: 'CMA API请求失败' });
    }
});

// 日本气象厅API代理
app.get('/api/jma/typhoon', async (req, res) => {
    try {
        const url = 'https://www.jma.go.jp/bosai/typhoon/data/typhoon.json';
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('JMA API错误:', error);
        res.status(500).json({ error: 'JMA API请求失败' });
    }
});

// 获取所有台风数据
app.get('/api/typhoon/all', async (req, res) => {
    try {
        const [hkoData, cmaData, jmaData] = await Promise.allSettled([
            fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=tc&lang=en').then(r => r.json()),
            fetch('https://tcdata.typhoon.org.cn/api/typhoon/list').then(r => r.json()),
            fetch('https://www.jma.go.jp/bosai/typhoon/data/typhoon.json').then(r => r.json())
        ]);

        res.json({
            hko: hkoData.status === 'fulfilled' ? hkoData.value : null,
            cma: cmaData.status === 'fulfilled' ? cmaData.value : null,
            jma: jmaData.status === 'fulfilled' ? jmaData.value : null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('获取台风数据失败:', error);
        res.status(500).json({ error: '获取台风数据失败' });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        services: {
            hko: 'available',
            cma: 'available',
            jma: 'available'
        }
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`台风数据代理服务器运行在端口 ${PORT}`);
    console.log(`访问 http://localhost:${PORT} 查看应用`);
});

module.exports = app;
