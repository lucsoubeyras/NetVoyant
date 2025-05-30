// src/topology/topologyRenderer.js

let canvas, ctx;
let deviceBoxes = [];

export function initTopologyCanvas(canvasElement) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

export function drawDevices(devices, layoutMap) {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  deviceBoxes = [];

  const routerIndex = 0;
  const router = devices[routerIndex];
  const routerPos = layoutMap[routerIndex];

  // Diğer cihazlara bağlantı çizgisi çiz
  for (let i = 1; i < devices.length; i++) {
    const targetPos = layoutMap[i];
    drawConnection(routerPos, targetPos);
  }

  // Tüm cihazları çiz
  for (let i = 0; i < devices.length; i++) {
    const d = devices[i];
    const pos = layoutMap[i];
    drawDeviceBox(d, pos.x, pos.y);
  }
}

function drawConnection(from, to) {
  ctx.strokeStyle = '#00bcd4';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(from.x + 90, from.y + 40);
  ctx.lineTo(to.x + 90, to.y + 40);
  ctx.stroke();
}

function drawDeviceBox(device, x, y) {
  const boxWidth = 180;
  const boxHeight = 80;
  const padding = 10;

  ctx.fillStyle = '#1c1f2b';
  ctx.strokeStyle = '#00bcd4';
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, boxWidth, boxHeight);
  ctx.strokeRect(x, y, boxWidth, boxHeight);

  ctx.fillStyle = '#ffffff';
  ctx.font = '13px Segoe UI';
  ctx.fillText(`📡 ${device.ip}`, x + padding, y + 20);
  ctx.fillText(`🔗 ${device.mac}`, x + padding, y + 38);
  ctx.fillText(`🖥️ ${device.deviceType}`, x + padding, y + 56);

  deviceBoxes.push({ x, y, width: boxWidth, height: boxHeight });
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth - 60;
  canvas.height = window.innerHeight - 120;
  drawDevicesFromBuffer();
}

let lastDevices = [], lastLayout = [];
export function drawDevicesFromBuffer() {
  if (lastDevices.length && lastLayout.length) {
    drawDevices(lastDevices, lastLayout);
  }
}

export function updateTopology(devices, layout) {
  lastDevices = devices;
  lastLayout = layout;
  drawDevices(devices, layout);
}
