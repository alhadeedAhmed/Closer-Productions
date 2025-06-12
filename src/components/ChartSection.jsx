import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartSection() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const data = {
    labels: [
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
    ],
    datasets: [
      {
        label: "Total shows to date",
        data: [1, 3, 6, 10, 13, 15, 18, 22, 27, 28, 30, 34, 35, 36, 37],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#3B82F6",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Cumulative platforms",
        data: [1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 19],
        borderColor: "#10B981",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#10B981",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Movies",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2],
        borderColor: "#EF4444",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderDash: [2, 2],
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#EF4444",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "line",
          font: {
            size: 12,
          },
          color: "#6B7280",
          generateLabels: function (chart) {
            const datasets = chart.data.datasets;
            return datasets.map((dataset) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor,
              strokeStyle: dataset.borderColor,
              lineWidth: dataset.borderDash ? 2 : 3,
              lineDash: dataset.borderDash || [],
              pointStyle: dataset.borderDash ? "circle" : "line",
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: true, color: "rgba(0, 0, 0, 0.1)" },
        ticks: { color: "#6B7280", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        max: 40,
        grid: { display: true, color: "rgba(0, 0, 0, 0.1)" },
        ticks: { stepSize: 5, color: "#6B7280", font: { size: 11 } },
      },
    },
    interaction: { intersect: false, mode: "index" },
    elements: { point: { hoverBorderWidth: 3 } },
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data,
        options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:max-w-5xl lg:mx-auto my-8">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-6">
        <div className="relative h-[300px] sm:h-[400px] lg:h-[450px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </section>
  );
}
