// src/logger.js
import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

export function saveScanResults(devices) {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `scan-${timestamp}.json`;
    const filePath = path.join(logDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(devices, null, 2), 'utf-8');
    console.log(`[✓] Tarama sonuçları kaydedildi: ${filePath}`);
}
