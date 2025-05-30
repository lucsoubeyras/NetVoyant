// src/topology/topologyPanel.js
import { generateLayout } from './topologyLayout.js';
import { initTopologyCanvas, updateTopology } from './topologyRenderer.js';

let container, canvas;

export function createTopologyPanel(devices) {
  if (!devices || !devices.length) return;

  if (document.getElementById('topology-container')) {
    document.getElementById('topology-container').style.display = 'flex';
    redraw(devices);
    return;
  }

  container = document.createElement('div');
  container.id = 'topology-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.9);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `;

  canvas = document.createElement('canvas');
  canvas.id = 'topology-canvas';
  canvas.style.cssText = 'background-color: transparent;';
  container.appendChild(canvas);

  const closeBtn = document.createElement('button');
  closeBtn.innerText = '❌ Kapat';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 30px;
    padding: 10px 16px;
    font-size: 15px;
    background-color: #00bcd4;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
  `;
  closeBtn.onclick = () => (container.style.display = 'none');
  container.appendChild(closeBtn);

  document.body.appendChild(container);
  initTopologyCanvas(canvas);
  redraw(devices);
}

function redraw(devices) {
  const layout = generateLayout(devices);
  updateTopology(devices, layout);
}
