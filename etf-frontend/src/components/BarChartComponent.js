import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { pubSub } from "../pubsub/PubSub.js";

// Register the necessary components with Chart.js
ChartJS.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Memoize the chart configuration to avoid unnecessary re-renders
  const chartConfig = useMemo(() => {
    return {
      type: "bar",
      data: {
        labels: chartData.map((entry) => entry.date),
        datasets: [
          {
            label: "Volume",
            data: chartData.map((entry) => entry.volume),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
            hoverBorderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeOutBounce",
        },
        plugins: {
          title: {
            display: true,
            text: "Volume Chart",
            font: {
              size: 18,
              family: "'Roboto', sans-serif",
              weight: "bold",
            },
            color: "#333",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += parseInt(context.parsed.y).toLocaleString();
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
              color: "#333",
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
              color: "#333",
            },
            ticks: {
              color: "#333",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Volume",
              font: {
                size: 16,
                family: "'Roboto', sans-serif",
              },
              color: "#333",
            },
            ticks: {
              color: "#333",
              callback: (value) => value.toLocaleString(),
            },
          },
        },
        hover: {
          mode: "nearest",
          intersect: true,
          animationDuration: 400,
        },
      },
    };
  }, [chartData]);

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

  useEffect(() => {
    // Subscribe to data changes
    const handleDataChange = ({ data }) => {
      setChartData(data);
    };

    pubSub.subscribe("dataChanged", handleDataChange);

    // Cleanup subscription on component unmount
    return () => {
      pubSub.unsubscribe("dataChanged", handleDataChange);
    };
  }, []);

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChartComponent;
