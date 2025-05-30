// src/renderer.js
const { ipcRenderer } = require('electron');
import { chartData, resetChartData, updateChartData, exportChartData } from './statsCache.js';
import { createTopologyPanel } from './topology/topologyPanel.js';
import { loadSavedTheme, setTheme } from './themes.js';

let isPaused = false;
let renderBuffer = [];
let scannedDevices = [];

loadSavedTheme();

window.addEventListener('DOMContentLoaded', async () => {
    const range = await ipcRenderer.invoke('get-default-ip-range');
    if (range.startIP && range.endIP) {
        document.getElementById('start-ip').value = range.startIP;
        document.getElementById('end-ip').value = range.endIP;
    }

    document.getElementById('pause-scan').style.display = "none";
    document.getElementById('stats-btn').style.display = "none";

    showInternetSpeed();
    showNetworkInfo();

    setInterval(renderBufferedDevices, 100);
});

async function showInternetSpeed() {
    const internetStatus = document.getElementById('internet-speed');
    if (!internetStatus) return;

    let firstRun = true;
    while (true) {
        const result = await ipcRenderer.invoke('run-speed-test');

        if (!result.error) {
            internetStatus.textContent = `📶 İnternet Hızı: 📥 ${result.download} Mbps | 📤 ${result.upload} Mbps | 🕓 ${result.ping}`;
            firstRun = false;
        } else if (firstRun) {
            internetStatus.textContent = `Hız testi hatası: ${result.error}`;
            firstRun = false;
        }

        await new Promise(resolve => setTimeout(resolve, 4000));
    }
}

async function showNetworkInfo() {
    const netInfo = await ipcRenderer.invoke('get-network-info');
    const div = document.getElementById('network-info');
    if (!div) return;

    div.innerHTML = `
        <div class="network-title">💻 Bilgisayarınızın Ağ Bilgileri</div>
        <div class="network-grid">
            <div>🖥️ <strong>Ad:</strong> ${netInfo.hostname}</div>
            <div>🌐 <strong>IP:</strong> ${netInfo.ip}</div>
            <div>🔗 <strong>MAC:</strong> ${netInfo.mac}</div>
            <div>🔌 <strong>Bağlantı:</strong> ${netInfo.connectionType}</div>
            <div>📶 <strong>SSID:</strong> ${netInfo.ssid}</div>
            <div>📡 <strong>BSSID:</strong> ${netInfo.bssid}</div>
            <div>🛣️ <strong>Gateway:</strong> ${netInfo.gateway}</div>
            <div>🧭 <strong>DNS:</strong> ${netInfo.dns.join(', ')}</div>
        </div>
    `;
}

document.getElementById('start-scan').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('pause-scan').innerText = "🛑 Taramayı Durdur";
    document.getElementById('pause-scan').style.display = "inline-flex";

    const startIP = document.getElementById('start-ip').value;
    const endIP = document.getElementById('end-ip').value;
    const port = document.getElementById('port').value || 80;

    document.getElementById('results').innerHTML = "";
    document.getElementById('checkmark').style.display = "none";
    document.getElementById('status').textContent = "Tarama başlatıldı...";
    document.getElementById('progress-bar').style.width = "0%";
    document.getElementById('stats-btn').style.display = "none";

    resetChartData();
    scannedDevices = [];
    ipcRenderer.send('start-scan', startIP, endIP, port);
});

document.getElementById('pause-scan').addEventListener('click', () => {
    isPaused = !isPaused;
    ipcRenderer.send('toggle-pause-scan', isPaused);

    const btn = document.getElementById('pause-scan');
    btn.innerText = isPaused ? "▶️ Devam Et" : "🛑 Taramayı Durdur";
});

ipcRenderer.on('scan-result', (event, device) => {
    scannedDevices.push(device);
    renderBuffer.push(device);
    updateChartData(device);
});

function renderBufferedDevices() {
    const results = document.getElementById('results');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 5 && renderBuffer.length > 0; i++) {
        const device = renderBuffer.shift();

        const item = document.createElement('li');
        item.classList.add('device-item');
        item.innerHTML = `
            <span title="IP Adresi">📡 <strong>${device.ip}</strong></span>
            <span title="MAC Adresi">🔗 ${device.mac}</span>
            <span title="Üretici Firma">🖥️ ${device.manufacturer}</span>
            <span title="Cihaz Türü">🔧 ${device.deviceType}</span>
            <span title="Yanıt Süresi">⏱️ ${device.responseTime}ms</span>
            <span title="Web Arayüzü">🌐 ${
                device.web?.http || device.web?.https
                    ? (device.web.https ? 'HTTPS' : 'HTTP') + ' açık'
                    : 'Kapalı'
            }</span>
            <span title="Bağlantı Türü">🔌 ${device.connectionType}</span>
        `;
        fragment.appendChild(item);
    }

    results.appendChild(fragment);
}

ipcRenderer.on('scan-complete', (event, progress, isComplete) => {
    const progressBar = document.getElementById('progress-bar');
    const status = document.getElementById('status');
    progressBar.style.width = `${progress}%`;

    if (isComplete) {
        status.textContent = "Tarama tamamlandı.";
        document.getElementById('checkmark').style.display = "block";
        document.getElementById('pause-scan').style.display = "none";
        document.getElementById('stats-btn').style.display = "inline-block";
        document.getElementById('export-btn').style.display = "inline-block";
        document.getElementById('topology-btn').style.display = "inline-block";
        localStorage.setItem("chartData", JSON.stringify(exportChartData()));
    }
});

document.getElementById('export-btn').addEventListener('click', () => {
    if (scannedDevices.length === 0) return;

    const headers = ['IP', 'MAC', 'Üretici', 'Cihaz Türü', 'Yanıt', 'Bağlantı', 'HTTP', 'HTTPS'];
    const csvRows = [
        headers.join(','),
        ...scannedDevices.map(d =>
            [d.ip, d.mac, d.manufacturer, d.deviceType, d.responseTime, d.connectionType,
            d.web?.http ? 'Açık' : 'Kapalı', d.web?.https ? 'Açık' : 'Kapalı'].join(',')
        )
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `netvoyant_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('toggle-theme').addEventListener('click', () => {
    const html = document.documentElement;

    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);

    html.classList.add('fade-transition');
    setTimeout(() => {
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }, 100);
    setTimeout(() => {
        html.classList.remove('fade-transition');
    }, 500);
});

document.getElementById('min-btn').addEventListener('click', () => {
    ipcRenderer.send('window-control', 'minimize');
});
document.getElementById('max-btn').addEventListener('click', () => {
    ipcRenderer.send('window-control', 'maximize');
});
document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('window-control', 'close');
});

document.getElementById('stats-btn').addEventListener('click', () => {
    ipcRenderer.send('open-stats-window');
});

document.getElementById('topology-btn')?.addEventListener('click', () => {
    createTopologyPanel(scannedDevices);
});
