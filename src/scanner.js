// src/scanner.js
import ping from 'ping';
import { exec } from 'child_process';
import os from 'os';
import { generateIPs } from './utils.js';
import { getVendorFromMac, loadMacVendors } from './macLookup.js';
import { getDeviceType } from './deviceClassifier.js';
import { checkWebPorts } from './webChecker.js';
import { getConnectionType } from './connectionType.js';

loadMacVendors();

async function getMacAddress(ip) {
    return new Promise((resolve) => {
        if (os.platform() === 'win32') {
            exec(`arp -a ${ip}`, (err, stdout) => {
                if (err || !stdout) {
                    resolve("Bilinmiyor");
                } else {
                    const macMatch = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
                    resolve(macMatch ? macMatch[0].toUpperCase() : "Bilinmiyor");
                }
            });
        } else {
            resolve("Bilinmiyor (Sadece Windows)");
        }
    });
}

async function scanIP(ip, port) {
    try {
        const isAlive = await ping.promise.probe(ip, { timeout: 0.5 });
        if (isAlive.alive) {
            const mac = await getMacAddress(ip);
            const manufacturer = getVendorFromMac(mac);
            const deviceType = getDeviceType(manufacturer);
            const webPorts = await checkWebPorts(ip);

            // Akıllı bağlantı türü tespiti: hem üretici hem MAC üzerinden
            const connectionType = getConnectionType(manufacturer, mac);

            return {
                ip,
                responseTime: isAlive.time,
                mac,
                manufacturer,
                deviceType,
                connectionType,
                web: {
                    http: webPorts.http,
                    https: webPorts.https
                }
            };
        }
    } catch (err) {
        console.error(`[!] Hata: ${ip} - ${err.message}`);
    }
    return null;
}

export function startScan(startIP, endIP, port, onResult, onComplete, shouldPause) {
    const ips = generateIPs(startIP, endIP);
    let completed = 0;
    const totalIPs = ips.length;
    const maxParallelScans = 100;
    const scanQueue = [...ips];

    function processQueue() {
        if (scanQueue.length === 0) return;

        const ip = scanQueue.shift();

        const waitAndCheck = () => {
            if (shouldPause && shouldPause()) {
                setTimeout(waitAndCheck, 500);
            } else {
                scanIP(ip, port).then((device) => {
                    if (device) onResult(device);
                    completed++;
                    const progress = Math.floor((completed / totalIPs) * 100);
                    onComplete(progress, completed === totalIPs);
                    processQueue();
                });
            }
        };

        waitAndCheck();
    }

    for (let i = 0; i < maxParallelScans; i++) {
        processQueue();
    }
}
