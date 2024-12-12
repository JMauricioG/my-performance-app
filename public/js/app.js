// Lista de parámetros para análisis
const parameters = [
    "Movement to Receive",
    "Orientation of the First Touch",
    "Ball Distribution",
    "Finishing",
    "Pressing",
    "Intercepting",
    "Tackling",
  ];
  
  // Objeto para almacenar datos de análisis
  const analysisData = {};
  
  // Inicializa la tabla dinámica
  const tbody = document.querySelector("#analysis-table tbody");
  
  parameters.forEach((parameter) => {
    analysisData[parameter] = { positives: 0, negatives: 0 };
  
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${parameter}</td>
      <td>
        <div id="${parameter}-positives">0</div>
        <button class="btn small gray" onclick="subtractPositive('${parameter}')">-1</button>
      </td>
      <td>
        <div id="${parameter}-negatives">0</div>
        <button class="btn small gray" onclick="subtractNegative('${parameter}')">-1</button>
      </td>
      <td>
        <button class="btn small green" onclick="addPositive('${parameter}')">Positive</button>
        <button class="btn small red" onclick="addNegative('${parameter}')">Negative</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Funciones para modificar valores
  window.addPositive = (parameter) => {
    analysisData[parameter].positives++;
    document.getElementById(`${parameter}-positives`).innerText = analysisData[parameter].positives;
  };
  
  window.addNegative = (parameter) => {
    analysisData[parameter].negatives++;
    document.getElementById(`${parameter}-negatives`).innerText = analysisData[parameter].negatives;
  };
  
  window.subtractPositive = (parameter) => {
    if (analysisData[parameter].positives > 0) {
      analysisData[parameter].positives--;
      document.getElementById(`${parameter}-positives`).innerText = analysisData[parameter].positives;
    } else {
      alert("No hay más positivos que descontar.");
    }
  };
  
  window.subtractNegative = (parameter) => {
    if (analysisData[parameter].negatives > 0) {
      analysisData[parameter].negatives--;
      document.getElementById(`${parameter}-negatives`).innerText = analysisData[parameter].negatives;
    } else {
      alert("No hay más negativos que descontar.");
    }
  };
  
  document.getElementById("generate-graphs").addEventListener("click", () => {
    const chartsContainer = document.getElementById("charts-container");
    const chartsGrid = document.getElementById("charts-grid");

    // Limpiar gráficos previos
    chartsGrid.innerHTML = "";
    chartsContainer.classList.remove("hidden");

    // Crear gráficos para cada parámetro
    Object.keys(analysisData).forEach((parameter) => {
        // Crear un contenedor para el gráfico
        const chartWrapper = document.createElement("div");
        chartWrapper.style.display = "flex";
        chartWrapper.style.flexDirection = "column";
        chartWrapper.style.alignItems = "center";
        chartWrapper.style.margin = "20px";

        // Crear un canvas para el gráfico
        const canvas = document.createElement("canvas");
        canvas.id = `${parameter}-chart`;
        chartWrapper.appendChild(canvas);

        // Agregar el contenedor al grid
        chartsGrid.appendChild(chartWrapper);

        const ctx = canvas.getContext("2d");
        const data = analysisData[parameter];
        const total = data.positives + data.negatives;

        // Calcular porcentajes
        const positivePercentage = total
            ? ((data.positives / total) * 100).toFixed(1)
            : 0;
        const negativePercentage = total
            ? ((data.negatives / total) * 100).toFixed(1)
            : 0;

        // Crear gráfico circular
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Positives", "Negatives"],
                datasets: [
                    {
                        data: [data.positives, data.negatives],
                        backgroundColor: ["#4caf50", "#f44336"],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false, // Ocultar leyenda
                    },
                    datalabels: {
                        display: true,
                        color: "#ffffff", // Color blanco para el texto
                        font: {
                            weight: "bold",
                            size: 16, // Tamaño del texto en el gráfico
                        },
                        formatter: (value, context) => {
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${percentage}%`;
                        },
                    },
                    title: {
                        display: true,
                        text: parameter, // Solo se agrega aquí
                        font: {
                            size: 24, // Tamaño del título
                            weight: "bold",
                        },
                        color: "#fff", // Color del título
                        padding: {
                            bottom: 20, // Espacio entre el título y el gráfico
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: true,
            },
            plugins: [ChartDataLabels], // Asegúrate de tener Chart.js Data Labels plugin
        });
    });
});
