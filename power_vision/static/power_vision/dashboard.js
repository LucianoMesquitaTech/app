document.addEventListener('DOMContentLoaded', () => {
  console.log("🧠 Dashboard reiniciado...");

  // ⛔ Remove gráficos anteriores se existirem
  if (window.graficoTemperatura instanceof Chart) window.graficoTemperatura.destroy();
  if (window.graficoUmidade instanceof Chart) window.graficoUmidade.destroy();

  // 📦 Localiza elementos JSON
  const elLabels = document.getElementById('labelsJSON');
  const elTemp = document.getElementById('tempJSON');
  const elUmid = document.getElementById('umidJSON');

// Temperatura
new Chart(document.getElementById("graficoTemperatura"), {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Temperatura (°C)',
      data: temperaturas,
      borderColor: '#3f51b5',
      backgroundColor: 'transparent',
      tension: 0.4
    }]
  }
});

// Umidade
new Chart(document.getElementById("graficoUmidade"), {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Umidade (%)',
      data: umidades,
      borderColor: '#e91e63',
      backgroundColor: 'transparent',
      tension: 0.4
    }]
  }
});

  // ⚠️ Valida presença dos elementos
  if (!elLabels || !elTemp || !elUmid) {
    console.error("❌ Elementos JSON ausentes.");
    return;
  }

  // 🧪 Tenta converter JSON com segurança
  let labels, dadosTemperatura, dadosUmidade;

  try {
    labels = JSON.parse(elLabels.textContent);
    dadosTemperatura = JSON.parse(elTemp.textContent);
    dadosUmidade = JSON.parse(elUmid.textContent);
  } catch (error) {
    console.error("❌ Erro ao parsear dados JSON:", error);
    return;
  }

  // 🎨 Configuração base compartilhada entre os gráficos
  const configBase = {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      scales: {
        x: { ticks: { color: '#444' } },
        y: { ticks: { color: '#444' }, beginAtZero: true }
      },
      plugins: {
        legend: { labels: { color: '#222' } }
      }
    }
  };

  // 🌡️ Gráfico de Temperatura
  const ctxTemp = document.getElementById('graficoTemperatura')?.getContext('2d');
  if (ctxTemp) {
    window.graficoTemperatura = new Chart(ctxTemp, {
      ...configBase,
      data: {
        labels,
        datasets: [{
          label: 'Temperatura (°C)',
          data: dadosTemperatura,
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244,63,94,0.1)',
          tension: 0.3,
          fill: true
        }]
      }
    });
  } else {
    console.warn("⚠️ Canvas de temperatura não encontrado.");
  }
  const toggleBtn = document.getElementById("toggleTheme");
  const body = document.body;

// Carrega preferência salva
  if (localStorage.theme === "dark") {
  body.classList.add("dark");
}

  toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.theme = body.classList.contains("dark") ? "dark" : "light";
});

  // 💧 Gráfico de Umidade
  const ctxUmid = document.getElementById('graficoUmidade')?.getContext('2d');
  if (ctxUmid) {
    window.graficoUmidade = new Chart(ctxUmid, {
      ...configBase,
      data: {
        labels,
        datasets: [{
          label: 'Umidade (%)',
          data: dadosUmidade,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.1)',
          tension: 0.3,
          fill: true
        }]
      }
    });
  } else {
    console.warn("⚠️ Canvas de umidade não encontrado.");
  }

  console.log("✅ Gráficos recriados com sucesso!");
  
});
