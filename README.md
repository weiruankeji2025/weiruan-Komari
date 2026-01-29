# Komarl Probe - 科技探针主题

一款具有科技感和立体感的服务器探针主题，支持实时监控 CPU、内存、磁盘、网络等系统指标，并提供剩余价值计算功能。

## 功能特性

### 核心监控

- **CPU 监控** - 实时显示 CPU 使用率、核心数、型号信息
- **内存监控** - 显示内存使用率、已用/总量
- **磁盘监控** - 显示磁盘使用率、已用/总量
- **网络监控** - 实时上传/下载速度、总流量统计
- **Ping 监控** - 网络延迟实时图表、最小/平均/最大延迟、丢包率

### 剩余价值

- 到期时间显示
- 剩余天数计算
- 购买价格记录
- 剩余价值自动计算
- 服务周期进度条
- 服务商/套餐信息

### 自定义选项

- 自定义站点标题
- 自定义 Logo
- 自定义背景图片
- 主题色调整
- 背景透明度调节
- 服务器名称/位置

### 设计特点

- 玻璃拟态设计风格
- 3D 立体仪表盘
- 动态网格背景
- 粒子动画效果
- 流畅的过渡动画
- 完全响应式布局

## 项目结构

```
komarl-probe/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── main.js         # 主要逻辑
├── config/
│   └── config.js       # 配置文件
├── assets/
│   └── images/         # 图片资源
├── LICENSE             # 许可证
└── README.md           # 说明文档
```

## 快速开始

### 1. 直接使用

将项目文件放置到 Web 服务器目录，直接访问 `index.html` 即可。

### 2. 配置修改

编辑 `config/config.js` 文件设置默认配置：

```javascript
window.komarl.defaultConfig = {
    // 站点标题
    siteTitle: 'My Server',

    // Logo URL
    logoUrl: 'assets/images/logo.png',

    // 背景图片
    backgroundUrl: 'https://example.com/bg.jpg',

    // 主题色
    themeColor: '#00f5ff',

    // 剩余价值配置
    purchaseDate: '2026-01-01',
    expireDate: '2026-12-31',
    purchasePrice: 1999,
    provider: '阿里云',
    planType: 'ECS 高性能型',
    billingCycle: '年付',

    // API地址（可选）
    apiUrl: 'https://your-api.com/stats',
    refreshInterval: 3
};
```

### 3. 在线配置

点击页面右上角的设置按钮，可在设置面板中实时修改配置，配置会自动保存到浏览器本地存储。

## API 对接

如需对接自己的探针后端，API 需返回以下 JSON 格式：

```json
{
    "cpu": {
        "usage": 35,
        "cores": 8,
        "model": "Intel Xeon E5-2680"
    },
    "memory": {
        "usage": 45,
        "used": 7.2,
        "total": 16
    },
    "disk": {
        "usage": 62,
        "used": 310,
        "total": 500
    },
    "network": {
        "uploadSpeed": 1024,
        "downloadSpeed": 2048,
        "totalUpload": 156.8,
        "totalDownload": 892.3
    },
    "ping": {
        "current": 25,
        "min": 10,
        "max": 45,
        "avg": 22,
        "packetLoss": 0
    },
    "system": {
        "os": "Ubuntu 22.04 LTS",
        "kernel": "5.15.0-91-generic",
        "ip": "192.168.1.100",
        "virtualization": "KVM",
        "architecture": "x86_64"
    }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| cpu.usage | number | CPU使用率 (0-100) |
| cpu.cores | number | CPU核心数 |
| cpu.model | string | CPU型号 |
| memory.usage | number | 内存使用率 (0-100) |
| memory.used | number | 已用内存 (GB) |
| memory.total | number | 总内存 (GB) |
| disk.usage | number | 磁盘使用率 (0-100) |
| disk.used | number | 已用磁盘 (GB) |
| disk.total | number | 总磁盘 (GB) |
| network.uploadSpeed | number | 上传速度 (Bytes/s) |
| network.downloadSpeed | number | 下载速度 (Bytes/s) |
| network.totalUpload | number | 总上传 (GB) |
| network.totalDownload | number | 总下载 (GB) |
| ping.current | number | 当前延迟 (ms) |
| ping.min | number | 最小延迟 (ms) |
| ping.max | number | 最大延迟 (ms) |
| ping.avg | number | 平均延迟 (ms) |
| ping.packetLoss | number | 丢包率 (%) |

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid, 动画)
- JavaScript (ES6+)
- Chart.js (图表渲染)
- Font Awesome (图标)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
