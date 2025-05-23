// src/renderer.js
const { ipcRenderer } = require('electron');

let isPaused = false;

// IP aralığını otomatik doldur
window.addEventListener('DOMContentLoaded', async () => {
    const range = await ipcRenderer.invoke('get-default-ip-range');
    if (range.startIP && range.endIP) {
        document.getElementById('start-ip').value = range.startIP;
        document.getElementById('end-ip').value = range.endIP;
    }
    // Başlangıçta durdur butonunu gizle
    document.getElementById('pause-scan').style.display = "none";
});

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
        <strong>${ip}</strong> <br>
        <span class="mac">MAC: ${mac}</span> <br>
        <span class="manufacturer">Üretici: ${manufacturer}</span> <br>
        <span class="device-type">Tür: ${deviceType}</span> <br>
        <span class="response-time">Yanıt Süresi: ${responseTime}ms</span>
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
