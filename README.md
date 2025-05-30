# ⚡ NetVoyant

**NetVoyant** is a modern network scanner that detects all devices on your local network in real-time. It provides key information such as IP address, MAC address, manufacturer, device type, response time, and web interface status.

Built using **Electron + Node.js**, it offers a clean, user-friendly interface even for non-technical users.

<p>
  <img src="https://img.shields.io/badge/platform-desktop-blue" />
  <img src="https://img.shields.io/badge/electron-^28.x-brightgreen" />
  <img src="https://img.shields.io/badge/nodejs-^20.x-green" />
  <img src="https://img.shields.io/badge/license-MIT-yellow" />
  <img src="https://img.shields.io/badge/status-active-success" />
</p>

---

## 🚀 Features

- 🔍 Real-time IP range scanning
- 🌐 MAC vendor resolution (local IEEE OUI database)
- 🧠 Device type inference based on vendor and ports
- 📊 Visual statistics panel with charts
- 🗺️ Live network topology map (router-centered)
- ⚡ Internet speed test via Cloudflare
- ⏱️ Device response time tracking
- ☁️ Wi-Fi / Ethernet connection type detection
- 🌙 Dark & light mode support
- 📁 Export results to CSV
- ⚙️ Electron-based fast desktop UI

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/lucsoubeyras/NetVoyant.git
cd NetVoyant
npm install
