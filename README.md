# ⚡ NetVoyant

**NetVoyant** is an advanced, real-time network scanner that empowers you to explore, analyze, and understand the devices connected to your local network. Whether you're an IT professional, network administrator, or a curious power user, NetVoyant offers the insight and visibility you need — with speed, clarity, and elegance.

Built with **Electron + Node.js**, NetVoyant combines the power of native desktop performance with a modern and intuitive interface. No terminals. No complexity. Just plug in, scan, and visualize.

<p>
  <img src="https://img.shields.io/badge/platform-desktop-blue" />
  <img src="https://img.shields.io/badge/electron-^28.x-brightgreen" />
  <img src="https://img.shields.io/badge/nodejs-^20.x-green" />
  <img src="https://img.shields.io/badge/license-MIT-yellow" />
  <img src="https://img.shields.io/badge/status-active-success" />
</p>

---

## 🚀 Key Features

### 🔍 Lightning-fast Network Discovery
- Scan IP ranges across your local subnet and detect devices in **real-time**.
- Results are displayed instantly as they are found — no need to wait for the full scan to finish.

### 🌐 MAC Address & Manufacturer Detection
- Instantly decode manufacturer info using a **locally stored IEEE OUI database** (no API limits or latency).
- Recognize brands like HP, Cisco, Huawei, Xiaomi, and more.

### 🧠 Intelligent Device Type Prediction
- Based on MAC vendor, connection type, and open ports, NetVoyant smartly categorizes devices as:
  - 💻 Computers
  - 📱 Phones
  - 🖨️ Printers
  - 🌐 Routers / Gateways
  - ❓ Unknown devices

### 📈 Interactive Statistics Window
- Dive into charts and graphs showing:
  - Device distribution by vendor
  - Device type ratios
  - Response time graphs
  - Port usage and more

### 🗺️ Network Topology View
- Visualize your network layout like a pro.
- A router-centric radial map displays discovered devices in a **circular layout** with **live connection lines**.
- See how devices relate spatially to your router or gateway.

### 📡 Built-in Internet Speed Test
- Live download & upload speed metrics via Cloudflare’s speed API.
- Real ping latency display helps monitor your connectivity health.

### 📋 Exportable Scan Results
- Export full scan results to `.CSV` with one click.
- Share results or analyze them with external tools like Excel, Google Sheets, or Power BI.

### 🌙 Dark / Light Mode Support
- Sleek UI with theme toggle — no need to hurt your eyes at night.

### 🧩 Full Local Network Info
- Know your current device’s:
  - Hostname
  - Local IP
  - MAC Address
  - Connection Type (Wi-Fi or Ethernet)
  - SSID, BSSID, DNS and Gateway

---

## 📦 Installation & Usage

### 1. Clone the Repository

```bash
git clone https://github.com/lucsoubeyras/NetVoyant.git
cd NetVoyant
npm install
