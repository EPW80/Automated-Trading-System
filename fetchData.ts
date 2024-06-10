import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Define the tickers
const tickers = ["SOXL", "SOXS"];

// Define the date range
const startDate = "2021-01-01";
const endDate = "2024-05-31";

// Function to fetch data from Yahoo Finance
async function fetchData(ticker: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${
      new Date(startDate).getTime() / 1000
    }&period2=${
      new Date(endDate).getTime() / 1000
    }&interval=1d&events=history&includeAdjustedClose=true`;
    const response = await axios.get(url);
    const data = response.data
      .split("\n")
      .slice(1)
      .map((line: string) => {
        const [date, open, high, low, close, adjClose, volume] = line.split(",");
        return { date, open, high, low, close, adjClose, volume };
      });
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
}

// Download the data
(async () => {
  try {
    const data: any = {};
    for (const ticker of tickers) {
      console.log(`Fetching data for ${ticker}...`);
      data[ticker] = await fetchData(ticker);
    }

    // Save the data in JSON format in the root directory
    const filePath = path.join(process.cwd(), "data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data successfully saved to data.json");
  } catch (error) {
    console.error("Failed to fetch and save data:", error);
  }
})();
