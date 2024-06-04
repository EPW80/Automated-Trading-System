import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => entry.date),
        datasets: [
          {
            label: 'Price',
            data: data.map(entry => entry.close),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: data.map(entry => entry.date)
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
