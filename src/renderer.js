// src/renderer.js
const { ipcRenderer } = require('electron');

let isPaused = false;

window.addEventListener('DOMContentLoaded', async () => {
    const range = await ipcRenderer.invoke('get-default-ip-range');
    if (range.startIP && range.endIP) {
        document.getElementById('start-ip').value = range.startIP;
        document.getElementById('end-ip').value = range.endIP;
    }

    document.getElementById('pause-scan').style.display = "none";

    showInternetSpeed();
    applySavedTheme();
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

function applySavedTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}

document.getElementById('start-scan').addEventListener('click', () => {
    isPaused = false;
    const pauseBtn = document.getElementById('pause-scan');
    pauseBtn.innerText = "🛑 Taramayı Durdur";
    pauseBtn.style.display = "inline-flex";

    const startIP = document.getElementById('start-ip').value;
    const endIP = document.getElementById('end-ip').value;
    const port = document.getElementById('port').value || 80;
    const results = document.getElementById('results');
    const checkmark = document.getElementById('checkmark');
    const status = document.getElementById('status');
    const progressBar = document.getElementById('progress-bar');

    results.innerHTML = "";
    checkmark.style.display = "none";
    status.textContent = "Tarama başlatıldı...";
    progressBar.style.width = "0%";

    ipcRenderer.send('start-scan', startIP, endIP, port);
});

document.getElementById('pause-scan').addEventListener('click', () => {
    isPaused = !isPaused;
    ipcRenderer.send('toggle-pause-scan', isPaused);

    const btn = document.getElementById('pause-scan');
    btn.innerText = isPaused ? "▶️ Devam Et" : "🛑 Taramayı Durdur";
});

ipcRenderer.on('scan-result', (event, device) => {
    const results = document.getElementById('results');
    const { ip, responseTime, mac, manufacturer, deviceType } = device;
    const item = document.createElement('li');
    item.classList.add('device-item');
    item.innerHTML = `
        <span title="IP Adresi">📡 <strong>${ip}</strong></span>
        <span title="MAC Adresi">🔗 ${mac}</span>
        <span title="Üretici Firma">🖥️ ${manufacturer}</span>
        <span title="Cihaz Türü">🔧 ${deviceType}</span>
        <span title="Yanıt Süresi">⏱️ ${responseTime}ms</span>
    `;
    results.appendChild(item);
});

ipcRenderer.on('scan-complete', (event, progress, isComplete) => {
    const progressBar = document.getElementById('progress-bar');
    const status = document.getElementById('status');
    progressBar.style.width = `${progress}%`;

    if (isComplete) {
        status.textContent = "Tarama tamamlandı.";
        document.getElementById('checkmark').style.display = "block";
        document.getElementById('pause-scan').style.display = "none";
    }
});

document.getElementById('toggle-theme').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});
