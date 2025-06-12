import React, { useEffect, useRef, useState } from "react";
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
  const [hiddenDatasets, setHiddenDatasets] = useState(new Set());

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
        hidden: hiddenDatasets.has(0),
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
        hidden: hiddenDatasets.has(1),
      },
      {
        label: "Movies",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        borderColor: "#EF4444",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderDash: [2, 6],
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#EF4444",
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: hiddenDatasets.has(2),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create custom legend
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        filter: function (tooltipItem) {
          // Only show tooltip for the hovered dataset
          return true;
        },
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
    interaction: {
      intersect: true, // Only show tooltip when hovering directly on points
      mode: "point", // Only show tooltip for the specific point being hovered
    },
    elements: { point: { hoverBorderWidth: 3 } },
  };

  const toggleDataset = (index) => {
    const newHiddenDatasets = new Set(hiddenDatasets);
    if (newHiddenDatasets.has(index)) {
      newHiddenDatasets.delete(index);
    } else {
      newHiddenDatasets.add(index);
    }
    setHiddenDatasets(newHiddenDatasets);
  };

  const getLegendIcon = (dataset, index) => {
    const isHidden = hiddenDatasets.has(index);
    const baseStyle = {
      width: "35px",
      height: "13px",
      display: "inline-block",
      marginRight: "8px",
      opacity: isHidden ? 0.3 : 1,
    };

    if (index === 0) {
      // Total shows to date - filled rectangle with light blue fill and dark blue border
      return (
        <span
          style={{
            ...baseStyle,
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            border: `2px solid ${dataset.borderColor}`,
            boxSizing: "border-box",
          }}
        />
      );
    } else if (index === 1) {
      // Cumulative platforms - dashed rectangle
      return (
        <span
          style={{
            ...baseStyle,
            backgroundColor: "rgba(16, 185, 129, 0.3)",
            border: `2px dashed ${dataset.borderColor}`,
            boxSizing: "border-box",
          }}
        />
      );
    } else {
      // Movies - dotted rectangle
      return (
        <span
          style={{
            ...baseStyle,
            backgroundColor: "rgba(239, 68, 68, 0.3)",
            border: `2px dotted ${dataset.borderColor}`,
            boxSizing: "border-box",
          }}
        />
      );
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Update dataset visibility based on state
      const updatedData = {
        ...data,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          hidden: hiddenDatasets.has(index),
        })),
      };

      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: updatedData,
        options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [hiddenDatasets]);

  return (
    <section className="w-full px-4 sm:px-6 lg:max-w-5xl lg:mx-auto my-8 mt-[-10px]">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-6">
        {/* Custom Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {data.datasets.map((dataset, index) => (
            <div
              key={index}
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleDataset(index)}
            >
              {getLegendIcon(dataset, index)}
              <span
                className={`text-sm text-gray-600 ${
                  hiddenDatasets.has(index) ? "line-through opacity-50" : ""
                }`}
                style={{ color: "#6B7280", fontSize: "12px" }}
              >
                {dataset.label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-[300px] sm:h-[400px] lg:h-[450px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </section>
  );
}
