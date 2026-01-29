/**
 * Komarl Probe - 配置文件
 * 在此文件中设置默认配置
 * 用户可以通过设置面板覆盖这些配置
 */

window.komarl = window.komarl || {};

/**
 * 默认配置
 * 这些配置会在页面加载时应用
 * 用户通过设置面板保存的配置会覆盖这些默认值
 */
window.komarl.defaultConfig = {
    // ==========================================
    // 外观设置
    // ==========================================

    // 站点标题
    siteTitle: 'Komarl Probe',

    // Logo URL (留空则隐藏Logo)
    // 支持相对路径或完整URL
    logoUrl: '',

    // 自定义背景图片URL (留空使用默认网格背景)
    // 支持相对路径或完整URL
    backgroundUrl: '',

    // 背景透明度 (0-100)
    backgroundOpacity: 80,

    // 主题色 (HEX格式)
    // 推荐颜色: #00f5ff (青色), #a855f7 (紫色), #10b981 (绿色), #f59e0b (橙色)
    themeColor: '#00f5ff',

    // ==========================================
    // 服务器设置
    // ==========================================

    // 服务器名称
    serverName: '主服务器',

    // 服务器位置
    serverLocation: '中国 - 上海',

    // ==========================================
    // 剩余价值设置
    // ==========================================

    // 购买日期 (YYYY-MM-DD 格式)
    purchaseDate: '2026-01-01',

    // 到期日期 (YYYY-MM-DD 格式)
    expireDate: '2026-12-31',

    // 购买价格 (数字，单位：元)
    purchasePrice: 1999,

    // 服务商名称
    provider: '云服务提供商',

    // 套餐类型
    planType: '高性能云服务器',

    // 计费周期 (月付/季付/半年付/年付/两年付/三年付)
    billingCycle: '年付',

    // ==========================================
    // API设置
    // ==========================================

    // 数据API地址 (留空使用模拟数据)
    // API需要返回以下格式的JSON数据:
    // {
    //     "cpu": { "usage": 35, "cores": 8, "model": "Intel Xeon" },
    //     "memory": { "usage": 45, "used": 7.2, "total": 16 },
    //     "disk": { "usage": 62, "used": 310, "total": 500 },
    //     "network": {
    //         "uploadSpeed": 1024,
    //         "downloadSpeed": 2048,
    //         "totalUpload": 156.8,
    //         "totalDownload": 892.3
    //     },
    //     "ping": {
    //         "current": 25,
    //         "min": 10,
    //         "max": 45,
    //         "avg": 22,
    //         "packetLoss": 0
    //     },
    //     "system": {
    //         "os": "Ubuntu 22.04 LTS",
    //         "kernel": "5.15.0-91-generic",
    //         "ip": "192.168.1.100",
    //         "virtualization": "KVM",
    //         "architecture": "x86_64"
    //     }
    // }
    apiUrl: '',

    // 数据刷新间隔 (秒)
    refreshInterval: 3,

    // ==========================================
    // 页脚设置
    // ==========================================

    // 页脚文字
    footerText: '科技探针主题',

    // 版权信息
    copyrightText: '© 2026 All Rights Reserved'
};

/**
 * 初始化配置
 * 合并默认配置和用户保存的配置
 */
(function initConfig() {
    // 尝试从本地存储加载用户配置
    let savedConfig = {};
    try {
        const saved = localStorage.getItem('komarlConfig');
        if (saved) {
            savedConfig = JSON.parse(saved);
        }
    } catch (e) {
        console.error('加载保存的配置失败:', e);
    }

    // 合并配置 (用户配置优先)
    window.komarl.config = {
        ...window.komarl.defaultConfig,
        ...savedConfig
    };
})();

/**
 * API 数据格式说明
 *
 * 如果你要对接自己的探针后端，API需要返回以下JSON格式：
 *
 * {
 *     // CPU信息
 *     "cpu": {
 *         "usage": 35,           // 使用率 (0-100)
 *         "cores": 8,            // 核心数
 *         "model": "Intel Xeon"  // CPU型号
 *     },
 *
 *     // 内存信息
 *     "memory": {
 *         "usage": 45,       // 使用率 (0-100)
 *         "used": 7.2,       // 已用内存 (GB)
 *         "total": 16        // 总内存 (GB)
 *     },
 *
 *     // 磁盘信息
 *     "disk": {
 *         "usage": 62,       // 使用率 (0-100)
 *         "used": 310,       // 已用空间 (GB)
 *         "total": 500       // 总空间 (GB)
 *     },
 *
 *     // 网络信息
 *     "network": {
 *         "uploadSpeed": 1024,      // 上传速度 (Bytes/s)
 *         "downloadSpeed": 2048,    // 下载速度 (Bytes/s)
 *         "totalUpload": 156.8,     // 总上传 (GB)
 *         "totalDownload": 892.3    // 总下载 (GB)
 *     },
 *
 *     // Ping/延迟信息
 *     "ping": {
 *         "current": 25,     // 当前延迟 (ms)
 *         "min": 10,         // 最小延迟 (ms)
 *         "max": 45,         // 最大延迟 (ms)
 *         "avg": 22,         // 平均延迟 (ms)
 *         "packetLoss": 0    // 丢包率 (%)
 *     },
 *
 *     // 系统信息
 *     "system": {
 *         "os": "Ubuntu 22.04 LTS",       // 操作系统
 *         "kernel": "5.15.0-91-generic",  // 内核版本
 *         "ip": "192.168.1.100",          // IP地址
 *         "virtualization": "KVM",        // 虚拟化类型
 *         "architecture": "x86_64"        // 系统架构
 *     },
 *
 *     // 运行时间 (可选)
 *     "uptime": 123456    // 运行秒数
 * }
 */
