// src/utils.js
export function generateIPs(startIP, endIP) {
    const ipToInt = ip => ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    const intToIp = int => Array.from({ length: 4 }, (_, i) => (int >>> (8 * (3 - i))) & 0xFF).join('.');
    
    const start = ipToInt(startIP);
    const end = ipToInt(endIP);
    return Array.from({ length: end - start + 1 }, (_, i) => intToIp(start + i));
}