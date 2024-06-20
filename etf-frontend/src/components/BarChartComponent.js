import React, { useEffect, useRef, useMemo } from "react";
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

const BarChartComponent = ({ data }) => {
  const chartRef = useRef(null); // Reference to the canvas element
  const chartInstanceRef = useRef(null); // Reference to the chart instance

  // Memoize the chart configuration to avoid unnecessary re-renders
  const chartConfig = useMemo(() => {
    return {
      type: "bar", // Define the chart type
      data: {
        labels: data.map((entry) => entry.date), // Map dates for x-axis labels
        datasets: [
          {
            label: "Volume", // Label for the dataset
            data: data.map((entry) => entry.volume), // Map volume data for y-axis
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
            borderColor: "rgba(75, 192, 192, 1)", // Border color
            borderWidth: 1, // Border width
            hoverBackgroundColor: "rgba(75, 192, 192, 0.4)", // Bar color on hover
            hoverBorderColor: "rgba(75, 192, 192, 1)", // Border color on hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Ensures the chart fills the container
        animation: {
          duration: 1000, // Animation duration in milliseconds
          easing: 'easeOutBounce', // Easing function for the animation
        },
        plugins: {
          title: {
            display: true,
            text: "Volume Chart", // Chart title
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
                label += parseInt(context.parsed.y).toLocaleString(); // Format tooltip value
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
              text: "Volume", // Y-axis title
              font: {
                size: 16,
                family: "'Roboto', sans-serif",
              },
              color: "#333", // Y-axis title color
            },
            ticks: {
              color: "#333", // Y-axis ticks color
              callback: (value) => value.toLocaleString(), // Format y-axis ticks
            },
          },
        },
        hover: {
          mode: 'nearest', // Highlight the nearest data point
          intersect: true, // Only trigger when hovering directly over a point
          animationDuration: 400, // Hover animation duration
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

export default BarChartComponent;
