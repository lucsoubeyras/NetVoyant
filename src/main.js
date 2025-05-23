// src/main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { startScan } from './scanner.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let scanPaused = false;

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('get-default-ip-range', () => {
        const interfaces = os.networkInterfaces();
        for (const name in interfaces) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    const ipParts = iface.address.split('.');
                    const base = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
                    return {
                        startIP: `${base}.1`,
                        endIP: `${base}.255`
                    };
                }
            }
        }
        return { startIP: '', endIP: '' };
    });

    ipcMain.on('toggle-pause-scan', (event, state) => {
        scanPaused = state;
    });

    ipcMain.on('start-scan', async (event, startIP, endIP, port) => {
        const { generateIPs } = await import('./utils.js');

        startScan(
            startIP,
            endIP,
            port,
            (device) => {
                if (!scanPaused) event.sender.send('scan-result', device);
            },
            (progress, isComplete) => {
                if (!scanPaused) event.sender.send('scan-complete', progress, isComplete);
            },
            () => scanPaused
        );
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
