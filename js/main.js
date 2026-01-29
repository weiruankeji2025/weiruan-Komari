/**
 * Komarl Probe - 科技探针主题
 * 主要JavaScript文件
 */

// ==========================================
// 全局变量
// ==========================================
let pingChart = null;
let resourceChart = null;
let pingHistory = [];
let cpuHistory = [];
let memoryHistory = [];
let diskHistory = [];
let timeLabels = [];
let updateInterval = null;
let uptimeSeconds = 0;

// 模拟数据状态
const simulatedData = {
    cpu: 35,
    memory: 45,
    disk: 62,
    uploadSpeed: 1024,
    downloadSpeed: 2048,
    totalUpload: 156.8,
    totalDownload: 892.3,
    ping: 25,
    packetLoss: 0
};

// ==========================================
// 初始化
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeCharts();
    loadSettings();
    applySettings();
    updateTime();
    startDataUpdates();

    // 每秒更新时间
    setInterval(updateTime, 1000);

    // 更新运行时间
    setInterval(updateUptime, 1000);
});

// ==========================================
// 粒子背景效果
// ==========================================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 6;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
}

// ==========================================
// 图表初始化
// ==========================================
function initializeCharts() {
    initPingChart();
    initResourceChart();
}

function initPingChart() {
    const ctx = document.getElementById('pingChart').getContext('2d');

    // 初始化空数据
    for (let i = 0; i < 30; i++) {
        timeLabels.push('');
        pingHistory.push(null);
    }

    pingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Ping (ms)',
                data: pingHistory,
                borderColor: '#00f5ff',
                backgroundColor: 'rgba(0, 245, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#00f5ff',
                pointHoverBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 40, 0.9)',
                    titleColor: '#00f5ff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function() {
                            return '网络延迟';
                        },
                        label: function(context) {
                            return context.parsed.y !== null ? context.parsed.y + ' ms' : 'N/A';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        callback: function(value) {
                            return value + ' ms';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initResourceChart() {
    const ctx = document.getElementById('resourceChart').getContext('2d');

    // 初始化空数据
    for (let i = 0; i < 30; i++) {
        cpuHistory.push(null);
        memoryHistory.push(null);
        diskHistory.push(null);
    }

    resourceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'CPU',
                    data: cpuHistory,
                    borderColor: '#00f5ff',
                    backgroundColor: 'rgba(0, 245, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: '内存',
                    data: memoryHistory,
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: '磁盘',
                    data: diskHistory,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 40, 0.9)',
                    titleColor: '#00f5ff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + (context.parsed.y !== null ? context.parsed.y + '%' : 'N/A');
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ==========================================
// 数据更新
// ==========================================
function startDataUpdates() {
    const interval = (window.komarl?.config?.refreshInterval || 3) * 1000;

    // 立即执行一次
    updateAllData();

    // 设置定时更新
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    updateInterval = setInterval(updateAllData, interval);
}

async function updateAllData() {
    const apiUrl = window.komarl?.config?.apiUrl;

    if (apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            updateUIWithData(data);
        } catch (error) {
            console.error('API请求失败，使用模拟数据:', error);
            updateWithSimulatedData();
        }
    } else {
        updateWithSimulatedData();
    }
}

function updateWithSimulatedData() {
    // 生成波动的模拟数据
    simulatedData.cpu = clamp(simulatedData.cpu + (Math.random() - 0.5) * 10, 10, 90);
    simulatedData.memory = clamp(simulatedData.memory + (Math.random() - 0.5) * 5, 20, 85);
    simulatedData.disk = clamp(simulatedData.disk + (Math.random() - 0.5) * 2, 30, 95);
    simulatedData.uploadSpeed = clamp(simulatedData.uploadSpeed + (Math.random() - 0.5) * 500, 100, 5000);
    simulatedData.downloadSpeed = clamp(simulatedData.downloadSpeed + (Math.random() - 0.5) * 1000, 200, 10000);
    simulatedData.ping = clamp(simulatedData.ping + (Math.random() - 0.5) * 10, 5, 100);
    simulatedData.totalUpload += simulatedData.uploadSpeed / 1024 / 1024 * 3;
    simulatedData.totalDownload += simulatedData.downloadSpeed / 1024 / 1024 * 3;

    updateUIWithData({
        cpu: {
            usage: simulatedData.cpu,
            cores: 8,
            model: 'Intel Xeon E5-2680 v4'
        },
        memory: {
            usage: simulatedData.memory,
            used: (16 * simulatedData.memory / 100).toFixed(1),
            total: 16
        },
        disk: {
            usage: simulatedData.disk,
            used: (500 * simulatedData.disk / 100).toFixed(0),
            total: 500
        },
        network: {
            uploadSpeed: simulatedData.uploadSpeed,
            downloadSpeed: simulatedData.downloadSpeed,
            totalUpload: simulatedData.totalUpload,
            totalDownload: simulatedData.totalDownload
        },
        ping: {
            current: simulatedData.ping,
            min: Math.max(5, simulatedData.ping - 15),
            max: simulatedData.ping + 20,
            avg: simulatedData.ping + 5,
            packetLoss: simulatedData.packetLoss
        },
        system: {
            os: 'Ubuntu 22.04.3 LTS',
            kernel: '5.15.0-91-generic',
            ip: '192.168.1.100',
            virtualization: 'KVM',
            architecture: 'x86_64'
        }
    });
}

function updateUIWithData(data) {
    // 更新CPU
    if (data.cpu) {
        updateGauge('cpuGauge', 'cpuValue', data.cpu.usage);
        updateElement('cpuCores', data.cpu.cores + ' 核');
        updateElement('cpuModel', data.cpu.model);
    }

    // 更新内存
    if (data.memory) {
        updateGauge('memoryGauge', 'memoryValue', data.memory.usage);
        updateElement('memoryUsed', data.memory.used + ' GB');
        updateElement('memoryTotal', data.memory.total + ' GB');
    }

    // 更新磁盘
    if (data.disk) {
        updateGauge('diskGauge', 'diskValue', data.disk.usage);
        updateElement('diskUsed', data.disk.used + ' GB');
        updateElement('diskTotal', data.disk.total + ' GB');
    }

    // 更新网络
    if (data.network) {
        updateElement('uploadSpeed', formatSpeed(data.network.uploadSpeed));
        updateElement('downloadSpeed', formatSpeed(data.network.downloadSpeed));
        updateElement('totalUpload', formatSize(data.network.totalUpload));
        updateElement('totalDownload', formatSize(data.network.totalDownload));
    }

    // 更新Ping
    if (data.ping) {
        updateElement('currentPing', Math.round(data.ping.current));
        updateElement('pingMin', Math.round(data.ping.min) + ' ms');
        updateElement('pingAvg', Math.round(data.ping.avg) + ' ms');
        updateElement('pingMax', Math.round(data.ping.max) + ' ms');
        updateElement('packetLoss', data.ping.packetLoss + '%');

        // 更新Ping图表
        updatePingChart(data.ping.current);
    }

    // 更新资源历史图表
    if (data.cpu && data.memory && data.disk) {
        updateResourceChart(data.cpu.usage, data.memory.usage, data.disk.usage);
    }

    // 更新系统信息
    if (data.system) {
        updateElement('osInfo', data.system.os);
        updateElement('kernelVersion', data.system.kernel);
        updateElement('ipAddress', data.system.ip);
        updateElement('virtualization', data.system.virtualization);
        updateElement('architecture', data.system.architecture);
    }

    // 更新系统时间
    updateElement('systemTime', new Date().toLocaleString('zh-CN'));
}

// ==========================================
// UI 更新辅助函数
// ==========================================
function updateGauge(gaugeId, valueId, percentage) {
    const gauge = document.getElementById(gaugeId);
    const valueEl = document.getElementById(valueId);

    if (gauge && valueEl) {
        // 圆形进度条计算 (周长约534)
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (percentage / 100) * circumference;
        gauge.style.strokeDashoffset = offset;

        valueEl.textContent = Math.round(percentage) + '%';
        valueEl.classList.add('data-update');
        setTimeout(() => valueEl.classList.remove('data-update'), 500);
    }
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
        el.classList.add('data-update');
        setTimeout(() => el.classList.remove('data-update'), 500);
    }
}

function updatePingChart(ping) {
    pingHistory.push(Math.round(ping));
    if (pingHistory.length > 30) {
        pingHistory.shift();
    }

    timeLabels.push(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    if (timeLabels.length > 30) {
        timeLabels.shift();
    }

    if (pingChart) {
        pingChart.data.labels = [...timeLabels];
        pingChart.data.datasets[0].data = [...pingHistory];
        pingChart.update('none');
    }
}

function updateResourceChart(cpu, memory, disk) {
    cpuHistory.push(Math.round(cpu));
    memoryHistory.push(Math.round(memory));
    diskHistory.push(Math.round(disk));

    if (cpuHistory.length > 30) {
        cpuHistory.shift();
        memoryHistory.shift();
        diskHistory.shift();
    }

    if (resourceChart) {
        resourceChart.data.datasets[0].data = [...cpuHistory];
        resourceChart.data.datasets[1].data = [...memoryHistory];
        resourceChart.data.datasets[2].data = [...diskHistory];
        resourceChart.update('none');
    }
}

// ==========================================
// 时间和运行时间
// ==========================================
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        timeEl.textContent = timeStr;
    }
}

function updateUptime() {
    uptimeSeconds++;

    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    const uptimeStr = `${padZero(days)}:${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

    const uptimeEl = document.getElementById('uptimeValue');
    if (uptimeEl) {
        uptimeEl.textContent = uptimeStr;
    }
}

// ==========================================
// 设置面板
// ==========================================
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        loadSettingsToForm();
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function loadSettingsToForm() {
    const config = window.komarl?.config || {};

    // 外观设置
    setInputValue('settingSiteTitle', config.siteTitle || 'Komarl Probe');
    setInputValue('settingLogoUrl', config.logoUrl || '');
    setInputValue('settingBgUrl', config.backgroundUrl || '');
    setInputValue('settingThemeColor', config.themeColor || '#00f5ff');
    setInputValue('settingBgOpacity', config.backgroundOpacity || 80);
    updateOpacityLabel();

    // 剩余价值设置
    setInputValue('settingPurchaseDate', config.purchaseDate || '');
    setInputValue('settingExpireDate', config.expireDate || '');
    setInputValue('settingPurchasePrice', config.purchasePrice || '');
    setInputValue('settingProvider', config.provider || '');
    setInputValue('settingPlanType', config.planType || '');
    setInputValue('settingBillingCycle', config.billingCycle || '年付');

    // 服务器设置
    setInputValue('settingServerName', config.serverName || '');
    setInputValue('settingServerLocation', config.serverLocation || '');

    // API设置
    setInputValue('settingApiUrl', config.apiUrl || '');
    setInputValue('settingRefreshInterval', config.refreshInterval || 3);
}

function saveSettings() {
    const config = {
        // 外观设置
        siteTitle: getInputValue('settingSiteTitle') || 'Komarl Probe',
        logoUrl: getInputValue('settingLogoUrl'),
        backgroundUrl: getInputValue('settingBgUrl'),
        themeColor: getInputValue('settingThemeColor') || '#00f5ff',
        backgroundOpacity: parseInt(getInputValue('settingBgOpacity')) || 80,

        // 剩余价值设置
        purchaseDate: getInputValue('settingPurchaseDate'),
        expireDate: getInputValue('settingExpireDate'),
        purchasePrice: parseFloat(getInputValue('settingPurchasePrice')) || 0,
        provider: getInputValue('settingProvider'),
        planType: getInputValue('settingPlanType'),
        billingCycle: getInputValue('settingBillingCycle'),

        // 服务器设置
        serverName: getInputValue('settingServerName'),
        serverLocation: getInputValue('settingServerLocation'),

        // API设置
        apiUrl: getInputValue('settingApiUrl'),
        refreshInterval: parseInt(getInputValue('settingRefreshInterval')) || 3
    };

    // 保存到本地存储
    localStorage.setItem('komarlConfig', JSON.stringify(config));

    // 更新全局配置
    window.komarl = window.komarl || {};
    window.komarl.config = config;

    // 应用设置
    applySettings();

    // 重新启动数据更新
    startDataUpdates();

    // 关闭设置面板
    closeSettings();

    // 显示保存成功提示
    showToast('设置已保存');
}

function resetSettings() {
    localStorage.removeItem('komarlConfig');
    window.komarl = { config: {} };
    loadSettingsToForm();
    applySettings();
    showToast('设置已重置');
}

function loadSettings() {
    const savedConfig = localStorage.getItem('komarlConfig');
    if (savedConfig) {
        try {
            window.komarl = window.komarl || {};
            window.komarl.config = JSON.parse(savedConfig);
        } catch (e) {
            console.error('加载配置失败:', e);
        }
    }
}

function applySettings() {
    const config = window.komarl?.config || {};

    // 应用站点标题
    const titleEl = document.getElementById('siteTitle');
    if (titleEl && config.siteTitle) {
        titleEl.textContent = config.siteTitle;
    }
    document.title = config.siteTitle || 'Komarl Probe - 科技探针主题';

    // 应用Logo
    const logoEl = document.getElementById('siteLogo');
    if (logoEl && config.logoUrl) {
        logoEl.src = config.logoUrl;
        logoEl.style.display = 'block';
    }

    // 应用背景图片
    const bgEl = document.getElementById('customBg');
    if (bgEl) {
        if (config.backgroundUrl) {
            bgEl.style.backgroundImage = `url(${config.backgroundUrl})`;
            bgEl.style.opacity = (config.backgroundOpacity || 80) / 100;
            bgEl.classList.add('active');
        } else {
            bgEl.classList.remove('active');
        }
    }

    // 应用主题色
    if (config.themeColor) {
        document.documentElement.style.setProperty('--primary-color', config.themeColor);

        // 计算辉光颜色
        const glowColor = hexToRgba(config.themeColor, 0.5);
        document.documentElement.style.setProperty('--primary-glow', glowColor);
    }

    // 应用服务器信息
    if (config.serverName) {
        updateElement('serverName', config.serverName);
    }
    if (config.serverLocation) {
        const locationEl = document.getElementById('serverLocation');
        if (locationEl) {
            locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${config.serverLocation}`;
        }
    }

    // 应用剩余价值信息
    applyValueSettings(config);
}

function applyValueSettings(config) {
    if (config.expireDate) {
        updateElement('expireDate', config.expireDate);

        // 计算剩余天数
        const today = new Date();
        const expireDate = new Date(config.expireDate);
        const remainingDays = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));
        updateElement('remainingDays', remainingDays > 0 ? remainingDays + ' 天' : '已到期');

        // 计算服务周期进度
        if (config.purchaseDate) {
            const purchaseDate = new Date(config.purchaseDate);
            const totalDays = Math.ceil((expireDate - purchaseDate) / (1000 * 60 * 60 * 24));
            const usedDays = Math.ceil((today - purchaseDate) / (1000 * 60 * 60 * 24));
            const progressPercent = Math.min(100, Math.max(0, (usedDays / totalDays) * 100));

            updateElement('cycleProgress', Math.round(100 - progressPercent) + '%');
            const fillEl = document.getElementById('cycleFill');
            if (fillEl) {
                fillEl.style.width = (100 - progressPercent) + '%';
            }

            // 计算剩余价值
            if (config.purchasePrice > 0) {
                const remainingValue = config.purchasePrice * (1 - usedDays / totalDays);
                updateElement('remainingValue', '¥ ' + Math.max(0, remainingValue).toFixed(2));
            }
        }
    }

    if (config.purchasePrice) {
        updateElement('purchasePrice', '¥ ' + config.purchasePrice.toLocaleString());
    }

    if (config.provider) {
        updateElement('provider', config.provider);
    }

    if (config.planType) {
        updateElement('planType', config.planType);
    }

    if (config.purchaseDate) {
        updateElement('purchaseDate', config.purchaseDate);
    }

    if (config.billingCycle) {
        updateElement('billingCycle', config.billingCycle);
    }
}

// ==========================================
// 工具函数
// ==========================================
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function formatSpeed(bytesPerSec) {
    if (bytesPerSec >= 1024 * 1024) {
        return (bytesPerSec / 1024 / 1024).toFixed(2) + ' MB/s';
    } else if (bytesPerSec >= 1024) {
        return (bytesPerSec / 1024).toFixed(2) + ' KB/s';
    } else {
        return bytesPerSec.toFixed(0) + ' B/s';
    }
}

function formatSize(gb) {
    if (gb >= 1024) {
        return (gb / 1024).toFixed(2) + ' TB';
    } else {
        return gb.toFixed(2) + ' GB';
    }
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.value = value;
    }
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function updateOpacityLabel() {
    const slider = document.getElementById('settingBgOpacity');
    const label = document.getElementById('opacityValue');
    if (slider && label) {
        label.textContent = slider.value + '%';
    }
}

function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 0.95rem;
        font-weight: 600;
        z-index: 2000;
        animation: toastIn 0.3s ease, toastOut 0.3s ease 2s forwards;
        box-shadow: 0 10px 40px rgba(0, 245, 255, 0.3);
    `;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastIn {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // 3秒后移除
    setTimeout(() => {
        toast.remove();
        style.remove();
    }, 2500);
}

// 透明度滑块事件
document.addEventListener('DOMContentLoaded', function() {
    const opacitySlider = document.getElementById('settingBgOpacity');
    if (opacitySlider) {
        opacitySlider.addEventListener('input', updateOpacityLabel);
    }
});

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('settingsModal');
    if (e.target === modal) {
        closeSettings();
    }
});

// ESC键关闭设置面板
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSettings();
    }
});
