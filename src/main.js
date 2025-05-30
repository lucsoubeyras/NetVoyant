// src/main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { startScan } from './scanner.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';
import { runSpeedTest } from './speedtest.js';
import { saveScanResults } from './logger.js';
import { getNetworkInfo } from './networkInfo.js';
import { getTheme } from './themes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let scanPaused = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

function createStatsWindow(theme = 'dark') {
  const statsWin = new BrowserWindow({
    width: 900,
    height: 700,
    frame: false,
    resizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [`--theme=${theme}`]
    }
  });

  statsWin.loadFile('stats.html');
}


app.whenReady().then(() => {
  createWindow();

  ipcMain.on('window-control', (event, command) => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    if (command === 'minimize') win.minimize();
    if (command === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
    if (command === 'close') win.close();
  });

  ipcMain.on('open-stats-window', () => {
  const currentTheme = getTheme(); // 'dark' veya 'light'
  createStatsWindow(currentTheme);
});


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

  ipcMain.handle('run-speed-test', async () => {
    return await runSpeedTest();
  });

  ipcMain.handle('get-network-info', () => {
    return getNetworkInfo();
  });

  ipcMain.on('toggle-pause-scan', (event, state) => {
    scanPaused = state;
  });

  ipcMain.on('start-scan', async (event, startIP, endIP, port) => {
    const { generateIPs } = await import('./utils.js');

    const foundDevices = [];

    startScan(
      startIP,
      endIP,
      port,
      (device) => {
        if (!scanPaused) {
          foundDevices.push(device);
          event.sender.send('scan-result', device);
        }
      },
      (progress, isComplete) => {
        if (!scanPaused) {
          event.sender.send('scan-complete', progress, isComplete);
          if (isComplete) saveScanResults(foundDevices);
        }
      },
      () => scanPaused
    );
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
