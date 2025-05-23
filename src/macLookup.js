// src/macLookup.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as csvParse from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ouiFile = path.join(__dirname, '../data/oui.csv');
let macMap = new Map();

export function loadMacVendors() {
    const raw = fs.readFileSync(ouiFile, 'utf8');
    const records = csvParse.parse(raw, { columns: false, skip_empty_lines: true });

    for (const row of records) {
        const prefix = row[1]?.toUpperCase(); // Örn: 38F9D3
        const vendor = row[2]?.replace(/^"|"$/g, '').trim(); // "Apple, Inc." → Apple, Inc.
        if (prefix && vendor) {
            const formatted = prefix.match(/.{1,2}/g).join('-'); // → 38-F9-D3
            macMap.set(formatted, vendor);
        }
    }
}

export function getVendorFromMac(mac) {
    if (!mac || typeof mac !== 'string') return "Bilinmeyen Üretici";
    const prefix = mac.slice(0, 8).toUpperCase().replace(/:/g, '-');
    return macMap.get(prefix) || "Bilinmeyen Üretici";
}
