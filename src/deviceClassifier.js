// deviceClassifier.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/manufacturerTypes.json');
let typeMap = {};

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    typeMap = JSON.parse(raw);
} catch (error) {
    console.warn('[!] Uyarı: manufacturerTypes.json yüklenemedi veya bulunamadı.');
}

function getDeviceType(manufacturer = '') {
    if (!manufacturer) return 'Bilinmeyen Cihaz';
    for (const key in typeMap) {
        if (manufacturer.toLowerCase().includes(key.toLowerCase())) {
            return typeMap[key];
        }
    }
    return 'Bilinmeyen Cihaz';
}

export { getDeviceType };
