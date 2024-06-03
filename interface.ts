import fs from "fs";
import { createCanvas } from "canvas";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

// Load the data from the JSON file
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

interface MarketData {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjClose: string;
  volume: string;
}

async function main() {
  const inquirer = await import("inquirer");

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

  const recentData: MarketData[] = data[symbol];
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

  const { generateGraph } = await inquirer.default.prompt([
    {
      type: "confirm",
      name: "generateGraph",
      message: "Would you like to generate a price graph?",
    },
  ]);

  if (generateGraph) {
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

function generateChart(symbol: string, startDate: string, endDate: string) {
  const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  const marketData = data[symbol].filter(
    (entry: any) =>
      new Date(entry.date) >= new Date(startDate) &&
      new Date(entry.date) <= new Date(endDate)
  );
  const dates = marketData.map((entry: any) => entry.date);
  const prices = marketData.map((entry: any) => entry.close);

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
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },
      },
    },
  });

  fs.writeFileSync("chart.png", canvas.toBuffer("image/png"));
  console.log("Price graph saved as chart.png");
}

main();
