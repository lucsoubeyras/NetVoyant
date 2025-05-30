// src/stats.js

document.addEventListener("DOMContentLoaded", () => {
  const chartData = JSON.parse(localStorage.getItem("chartData") || "{}");
  const ctx = document.getElementById('summaryChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(chartData.deviceTypes || {}),
      datasets: [
        {
          label: 'Cihaz Türleri',
          data: Object.values(chartData.deviceTypes || {}),
          backgroundColor: '#00BCD4'
        },
        {
          label: 'Bağlantı Türleri',
          data: Object.values(chartData.connectionTypes || {}),
          backgroundColor: '#FFC107'
        },
        {
          label: 'Üreticiler',
          data: Object.values(chartData.vendors || {}),
          backgroundColor: '#4CAF50'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: { size: 11 }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: { size: 11 }
          }
        }
      }
    }
  });

  const summaryList = document.getElementById('summaryList');

  const appendList = (title, data) => {
    const section = document.createElement('div');
    section.innerHTML = `<h3 style="margin-top:20px;">${title}</h3>`;
    const ul = document.createElement('ul');
    for (const [key, value] of Object.entries(data)) {
      const li = document.createElement('li');
      li.textContent = `${key} → ${value} cihaz`;
      ul.appendChild(li);
    }
    section.appendChild(ul);
    summaryList.appendChild(section);
  };

  appendList("Cihaz Türleri", chartData.deviceTypes || {});
  appendList("Bağlantı Türleri", chartData.connectionTypes || {});
  appendList("Üreticiler", chartData.vendors || {});
});
