document.addEventListener('DOMContentLoaded', () => {
  console.log("🧠 Dashboard reiniciado...");

  // ⛔ Remove gráficos anteriores se existirem
  if (window.graficoTemperatura instanceof Chart) window.graficoTemperatura.destroy();
  if (window.graficoUmidade instanceof Chart) window.graficoUmidade.destroy();

  // 📦 Localiza elementos JSON
  const elLabels = document.getElementById('labelsJSON');
  const elTemp = document.getElementById('tempJSON');
  const elUmid = document.getElementById('umidJSON');

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
  
  // 🎨 Configuração base
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
        x: { ticks: { color: '#D9A273' },grid: {color:'#D9A273', lineWidth: 0.5} },
        y: { ticks: { color: '#D9A273' }, grid: {color:'#D9A273'}, beginAtZero: false }
      },
      plugins: {
        legend: { labels: { color: '#D9A273' } },
        datalabels: {
    display: true,
    color: '#D9A273',
    font: {
      weight: 'bold',
      size: 12
    },
    formatter: value => `${value.toFixed(1)}°C`
  }
      }
    }
  };

  // 🌡️ Gráfico de Temperatura
  const ctxTemp = document.getElementById('graficoTemperatura')?.getContext('2d');
  if (ctxTemp) {
    const gradiente = ctxTemp.createLinearGradient(0, 0, 0, 400);
    gradiente.addColorStop(0, 'rgba(244,63,94,0.1)');
    gradiente.addColorStop(1, 'rgba(244,63,94,0)');
    window.graficoTemperatura = new Chart(ctxTemp, {
      ...configBase,
      data: {
        labels,
        datasets: [{
          label: 'Temperatura (°C)',
          data: dadosTemperatura,
          borderColor: '#D9A273',
          backgroundColor: gradiente,
          tension: 0.3,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4

        }]
      }
    });
  } else {
    console.warn("⚠️ Canvas de temperatura não encontrado.");
  }

  // 💧 Gráfico de Umidade
  const ctxUmid = document.getElementById('graficoUmidade')?.getContext('2d');
  if (ctxUmid) {
    const gradiente = ctxUmid.createLinearGradient(0, 0, 0, 400);
    gradiente.addColorStop(0, 'rgba(37,99,235,0.1)');
    gradiente.addColorStop(1, 'rgba(37,99,235,0)');
    window.graficoUmidade = new Chart(ctxUmid, {
      ...configBase,
      data: {
        labels,
        datasets: [{
          label: 'Umidade (%)',
          data: dadosUmidade,
          borderColor: '#D9A273',
          backgroundColor: gradiente,
          tension: 0.3,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4

          
        }]
      }
    });
  } else {
    console.warn("⚠️ Canvas de umidade não encontrado.");
  }

   async function atualizarGraficos() {
    try {
      const res = await fetch('/api/dados-climaticos/');
      const json = await res.json();

      // Atualiza Temperatura
      window.graficoTemperatura.data.labels = json.labels;
      window.graficoTemperatura.data.datasets[0].data = json.temperatura;
      window.graficoTemperatura.update();

      // Atualiza Umidade
      window.graficoUmidade.data.labels = json.labels;
      window.graficoUmidade.data.datasets[0].data = json.umidade;
      window.graficoUmidade.update();

    } catch (e) {
      console.error("Erro ao atualizar gráficos:", e);
    }
  }

  // 5) Chama a função a cada 10 segundos
  setInterval(atualizarGraficos, 10000);

  console.log("✅ Gráficos recriados com sucesso!");
});