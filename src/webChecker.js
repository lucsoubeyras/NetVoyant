// src/webChecker.js
import http from 'http';
import https from 'https';

export async function checkWebPorts(ip) {
    const results = {
        http: false,
        https: false
    };

    const checkPort = (protocolModule, port) => {
        return new Promise((resolve) => {
            const req = protocolModule.request({
                host: ip,
                port: port,
                method: 'HEAD',
                timeout: 1500,
            }, (res) => {
                resolve(true);
                req.destroy();
            });

            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    };

    results.http = await checkPort(http, 80);
    results.https = await checkPort(https, 443);
    return results;
}
