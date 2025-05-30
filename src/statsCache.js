// src/statsCache.js

const chartData = {
    deviceTypes: {},
    connectionTypes: {},
    vendors: {}
};

function resetChartData() {
    chartData.deviceTypes = {};
    chartData.connectionTypes = {};
    chartData.vendors = {};
}

function updateChartData(device) {
    if (device.deviceType) {
        chartData.deviceTypes[device.deviceType] = (chartData.deviceTypes[device.deviceType] || 0) + 1;
    }
    if (device.connectionType) {
        chartData.connectionTypes[device.connectionType] = (chartData.connectionTypes[device.connectionType] || 0) + 1;
    }
    if (device.manufacturer && device.manufacturer !== "Bilinmeyen Üretici") {
        chartData.vendors[device.manufacturer] = (chartData.vendors[device.manufacturer] || 0) + 1;
    }
}

function exportChartData() {
    return JSON.parse(JSON.stringify(chartData));
}

export { chartData, resetChartData, updateChartData, exportChartData };
