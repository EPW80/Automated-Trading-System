import React, { useEffect, useRef, useMemo, useState } from "react";
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
import { pubSub } from "../pubsub/PubSub.js";

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

const ChartComponent = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null); // Reference to the canvas element
  const chartInstanceRef = useRef(null); // Reference to the chart instance

  // Subscribe to data changes
  useEffect(() => {
    const handleDataChanged = ({ data }) => {
      setData(data);
    };
    pubSub.subscribe("dataChanged", handleDataChanged);

    return () => {
      pubSub.unsubscribe("dataChanged", handleDataChanged);
    };
  }, []);

  // Memoize the chart configuration to avoid unnecessary re-renders
  const chartConfig = useMemo(() => {
    return {
      type: "line", // Define the chart type
      data: {
        labels: data.map((entry) => entry.date), // Map dates for x-axis labels
        datasets: [
          {
            label: "Price", // Label for the dataset
            data: data.map((entry) => entry.close), // Map closing prices for y-axis data
            borderColor: "rgba(75, 192, 192, 1)", // Line color
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color under the line
            borderWidth: 2, // Line width
            pointRadius: 3, // Radius of the data points
            pointBackgroundColor: "rgba(75, 192, 192, 1)", // Data point color
            pointBorderColor: "#fff", // Border color of the data points
            fill: true, // Fill the area under the line
            tension: 0.4, // Smooths the line
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Ensures the chart fills the container
        animation: {
          duration: 2000, // Animation duration in milliseconds
          easing: "easeOutBounce", // Easing function for the animation
        },
        hover: {
          mode: "nearest", // Highlight the nearest data point
          intersect: true, // Only trigger when hovering directly over a point
          animationDuration: 400, // Hover animation duration
        },
        plugins: {
          title: {
            display: true,
            text: "Price Chart", // Chart title
            font: {
              size: 18,
              family: "'Roboto', sans-serif",
              weight: "bold",
            },
            color: "#333", // Title color
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += parseFloat(context.parsed.y).toFixed(2); // Format tooltip value
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
              color: "#333", // Legend color
            },
          },
        },
        scales: {
          x: {
            type: "category", // X-axis type
            title: {
              display: true,
              text: "Date", // X-axis title
              font: {
                size: 16,
                family: "'Roboto', sans-serif",
              },
              color: "#333", // X-axis title color
            },
            ticks: {
              color: "#333", // X-axis ticks color
            },
          },
          y: {
            beginAtZero: true, // Start y-axis from zero
            title: {
              display: true,
              text: "Price", // Y-axis title
              font: {
                size: 16,
                family: "'Roboto', sans-serif",
              },
              color: "#333", // Y-axis title color
            },
            ticks: {
              color: "#333", // Y-axis ticks color
            },
          },
        },
      },
    };
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return; // If chartRef is not set, do nothing

    const ctx = chartRef.current.getContext("2d"); // Get the context for drawing
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy previous chart instance if it exists
    }

    chartInstanceRef.current = new ChartJS(ctx, chartConfig); // Create new chart instance

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Clean up the chart instance on component unmount
      }
    };
  }, [chartConfig]); // Re-run effect when chartConfig changes

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas> {/* Canvas element for Chart.js */}
    </div>
  );
};

export default ChartComponent;
