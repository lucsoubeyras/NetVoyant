// src/networkInfo.js
import os from 'os';
import { networkInterfaces } from 'os';
import { execSync } from 'child_process';

export function getNetworkInfo() {
    const interfaces = networkInterfaces();
    let result = {
        hostname: os.hostname(),
        connectionType: '',
        ip: '',
        mac: '',
        ssid: '',
        gateway: '',
        dns: []
    };

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                result.ip = iface.address;
                result.mac = iface.mac;
                result.connectionType = name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wlan') ? 'Wi-Fi' : 'Ethernet';
            }
        }
    }

    try {
        const output = execSync('netsh wlan show interfaces').toString();
        const ssidMatch = output.match(/SSID\s+:\s(.*)/);
    if (ssidMatch) result.ssid = ssidMatch[1].trim();

        const bssidMatch = output.match(/BSSID\s+:\s(.*)/);
    if (bssidMatch) result.bssid = bssidMatch[1].trim();
    } catch {
        result.ssid = 'Kablosuz değil';
        result.bssid = '-';
    }


    try {
        const ipconfig = execSync('ipconfig /all').toString();
        const gatewayMatch = ipconfig.match(/Default Gateway[ .]*: (.+)/);
        if (gatewayMatch) result.gateway = gatewayMatch[1].trim();

        const dnsMatches = ipconfig.match(/DNS Servers[ .]*: (.+?)(\n|$)/g);
        if (dnsMatches) {
            dnsMatches.forEach(line => {
                const dns = line.split(':')[1]?.trim();
                if (dns) result.dns.push(dns);
            });
        }
    } catch {}

    return result;
}
