import React, { useEffect, useRef, useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components with Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Memoize the chart configuration to avoid unnecessary re-renders
  const chartConfig = useMemo(() => {
    return {
      type: "line",
      data: {
        labels: data.map((entry) => entry.date),
        datasets: [
          {
            label: "Price",
            data: data.map((entry) => entry.close),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointBorderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Price Chart",
            font: {
              size: 18,
              family: "'Roboto', sans-serif",
              weight: "bold",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += parseFloat(context.parsed.y).toFixed(2);
                return label;
              },
            },
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                size: 14,
                family: "'Roboto', sans-serif",
              },
            },
          },
        },
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Date",
              font: {
                size: 16,
                family: "'Roboto', sans-serif",
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Price",
              font: {
                size: 16,
                family: "'Roboto', sans-serif",
              },
            },
          },
        },
      },
    };
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new ChartJS(ctx, chartConfig);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartConfig]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
