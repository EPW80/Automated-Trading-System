import fs from "fs";
import { createCanvas } from "canvas";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { JSONDataAccess } from "./adapters/JSONDataAccess.js";
import { JSONDataAdapter } from "./adapters/JSONDataAdapter.js";
import { IDataAccess, MarketDataEntry } from "./adapters/IDataAccess.js";

const jsonDataAccess = new JSONDataAccess();
const dataAccess: IDataAccess<MarketDataEntry> = new JSONDataAdapter(
  jsonDataAccess
);

interface MarketData {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjClose: string;
  volume: string;
}

// Main function to run the program
async function main() {
  const inquirer = await import("inquirer");

  // Prompt the user to select a symbol
  const { symbol } = await inquirer.default.prompt([
    {
      type: "list",
      name: "symbol",
      message: "Choose the symbol",
      choices: ["SOXL", "SOXS"],
    },
  ]);

  console.log(`You selected: ${symbol}`);
  console.log(
    `Description: ${symbol} is an ETF focused on semiconductor companies with 3x leverage.`
  );

  const recentData: MarketDataEntry[] = await dataAccess.request(symbol);
  const lastEntry = recentData[recentData.length - 1];
  const prevEntry = recentData[recentData.length - 2];

  console.log(`Most recent date: ${lastEntry.date}`);
  console.log(`Most recent price: ${lastEntry.close}`);

  const percentageChange =
    ((parseFloat(lastEntry.close) - parseFloat(prevEntry.close)) /
      parseFloat(prevEntry.close)) *
    100;
  console.log(
    `Percentage change from previous date: ${percentageChange.toFixed(2)}%`
  );

  // Prompt the user to decide if they want to generate a graph
  const { generateGraph } = await inquirer.default.prompt([
    {
      type: "confirm",
      name: "generateGraph",
      message: "Would you like to generate a price graph?",
    },
  ]);

  if (generateGraph) {
    // Prompt the user to enter the start and end dates for the graph
    const { startDate, endDate } = await inquirer.default.prompt([
      {
        type: "input",
        name: "startDate",
        message: "Enter the start date (YYYY-MM-DD):",
        validate: (input: string) =>
          /\d{4}-\d{2}-\d{2}/.test(input)
            ? true
            : "Invalid date format. Use YYYY-MM-DD.",
      },
      {
        type: "input",
        name: "endDate",
        message: "Enter the end date (YYYY-MM-DD):",
        validate: (input: string) =>
          /\d{4}-\d{2}-\d{2}/.test(input)
            ? true
            : "Invalid date format. Use YYYY-MM-DD.",
      },
    ]);

    generateChart(symbol, startDate, endDate);
  }
}

/**
 * Generates a price chart for the specified symbol between the given dates.
 * @param {string} symbol - The symbol to generate the chart for.
 * @param {string} startDate - The start date for the chart data.
 * @param {string} endDate - The end date for the chart data.
 */
async function generateChart(
  symbol: string,
  startDate: string,
  endDate: string
) {
  const data = await dataAccess.request(symbol);
  const marketData = data.filter(
    (entry: MarketData) =>
      new Date(entry.date) >= new Date(startDate) &&
      new Date(entry.date) <= new Date(endDate)
  );
  const dates = marketData.map((entry: MarketData) => entry.date);
  const prices = marketData.map((entry: MarketData) => parseFloat(entry.close)); // Ensure prices are numbers

  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  new Chart(canvas as unknown as HTMLCanvasElement, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `${symbol} Price`,
          data: prices,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Add background color for better visualization
          borderWidth: 2, // Increase the border width for better visibility
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
          text: `${symbol} Price Chart`,
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
              label += parseFloat(
                context.parsed.y as unknown as string
              ).toFixed(2);
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
          type: "time",
          time: {
            unit: "day",
          },
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
            text: "Price",
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
      },
    },
  });

  fs.writeFileSync("chart.png", canvas.toBuffer("image/png"));
  console.log("Price graph saved as chart.png");
}

main();
