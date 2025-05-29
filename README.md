# ⚡ NetVoyant

**NetVoyant**, ağınızdaki cihazları gerçek zamanlı olarak tarayan, IP adresi, MAC adresi, üretici bilgisi ve cihaz türü gibi kritik verileri görselleştiren modern bir ağ keşif aracıdır.  
Electron + Node.js ile geliştirilmiştir ve teknik olmayan kullanıcılar için sade bir arayüz sunar.

![Platform](https://img.shields.io/badge/platform-electron%20%7C%20nodejs-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🚀 Özellikler

- 🔍 Gerçek zamanlı IP aralığı tarama
- 🧠 MAC adresinden üretici bilgisi çözümleme (IEEE OUI veritabanı ile)
- 💡 Üreticiye göre cihaz türü tahmini
- 📶 Cloudflare üzerinden basit hız testi
- 🧭 Ping yanıt süresi ölçümü
- 💻 Electron tabanlı kullanıcı dostu arayüz

---

## Proje Yapısı

NetVoyant/
├── src/
│   ├── main.js         # Electron başlangıç dosyası
│   ├── renderer.js     # UI mantığı
│   ├── scanner.js      # Ağ tarama modülü
│   ├── speedtest.js    # İndirme hızı testi modülü
├── assets/             # Stil dosyaları, görseller
├── oui.csv             # MAC adresi üretici verisi
├── index.html          # Arayüz HTML yapısı
├── package.json        # Proje konfigürasyonu
└── README.md

---

## 🛠️ Kurulum

### 1. Reponun Kopyalanması ve Kurulum
```bash
git clone https://github.com/lucsoubeyras/NetVoyant.git
cd NetVoyant
npm install
