// src/connectionType.js

// Wi-Fi odaklı üretici adları
const wifiVendors = [
    "Intel", "Qualcomm", "MediaTek", "Broadcom", "Atheros", "Realtek",
    "AzureWave", "Ralink", "Marvell", "Quantenna", "Murata", "Lite-On",
    "TP-Link", "D-Link", "Ubiquiti", "Xiaomi", "ZTE", "Huawei", "Netgear",
    "Tenda", "ASUS", "Imilab", "Totolink"
];

// MAC adresinden kablosuz olduğunu bilinen prefix örnekleri
const wifiMacPrefixes = [
    "78-DF-72", // Imilab (Xiaomi ekosistemi, IP kameralar, robot süpürgeler)
    "F4-12-DA", // ZTE Wi-Fi
    "94-27-70", // BSH IoT cihazlar
    "CC-BC-E3", // Huawei modem Wi-Fi
    "C8-D7-7B", // Bosch Home Connect Wi-Fi
    "D0-76-E7", // TP-Link Wi-Fi
    "60-E3-AC", // Realtek Wireless
    "E8-94-F6", // Xiaomi/Redmi Router
    "FC-D7-33", // Broadcom Wi-Fi
    "BC-44-86", // Atheros Wi-Fi
];

export function getConnectionType(manufacturer = "", mac = "") {
    if (!manufacturer && !mac) return "Bilinmiyor";

    // Üretici adına göre kontrol
    for (const vendor of wifiVendors) {
        if (manufacturer.toLowerCase().includes(vendor.toLowerCase())) {
            return "Kablosuz (Wi-Fi)";
        }
    }

    // MAC prefix'e göre kontrol
    const normalizedMac = mac.toUpperCase().replace(/:/g, '-');
    const prefix = normalizedMac.slice(0, 8);
    if (wifiMacPrefixes.includes(prefix)) {
        return "Kablosuz (Wi-Fi)";
    }

    return "Kablolu (Ethernet)";
}
