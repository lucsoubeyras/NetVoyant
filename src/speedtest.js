// src/speedtest.js
import https from 'https';
import { performance } from 'perf_hooks';

export async function runSpeedTest() {
    return new Promise((resolve) => {
        const url = 'https://speed.cloudflare.com/__down?bytes=5000000'; // 5 MB
        let totalBytes = 0;
        const start = performance.now();

        https.get(url, (res) => {
            res.on('data', chunk => {
                totalBytes += chunk.length;
            });

            res.on('end', () => {
                const end = performance.now();
                const duration = (end - start) / 1000;
                const speedMbps = ((totalBytes * 8) / 1e6 / duration).toFixed(2);
                resolve({
                    download: speedMbps,
                    upload: 'N/A',
                    ping: 'Gerçek Hedef'
                });
            });

        }).on('error', () => {
            resolve({ error: "İnternet bağlantısı başarısız" });
        });

        // Zaman aşımı
        setTimeout(() => {
            resolve({ error: "Zaman aşımı" });
        }, 8000);
    });
}
