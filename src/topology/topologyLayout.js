// src/topology/topologyLayout.js

/**
 * Cihazları dairesel düzende yerleştirir
 * Router'ı merkeze alır, diğer cihazları etrafına dizer
 */
export function generateLayout(devices) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const layout = [];
  const router = devices.find(d => d.deviceType.toLowerCase().includes("router") || d.deviceType.toLowerCase().includes("modem") || d.ip.endsWith(".1"));
  const others = devices.filter(d => d !== router);

  // Router merkeze
  if (router) {
    layout.push({ x: centerX - 90, y: centerY - 40 });
  }

  // Diğer cihazları çember etrafına yerleştir
  const angleStep = (2 * Math.PI) / others.length;
  others.forEach((device, i) => {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle) - 90;
    const y = centerY + radius * Math.sin(angle) - 40;
    layout.push({ x, y });
  });

  return layout;
}