// src/adapters/JSONDataAccess.ts

import axios from "axios";
import fs from "fs";
import path from "path";
import { MarketDataEntry } from "./IDataAccess"; // Import the MarketDataEntry interface
import { pubSub } from "../pubsub/PubSub.js"; // Import the pubsub instance

// Define a class that implements the IDataAccess interface
export class JSONDataAccess {
  private data: { [key: string]: MarketDataEntry[] } = {};
  private readonly filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), "data.json");
    this.loadDataFromFile();
  }

  // Load data from the JSON file if it exists
  private loadDataFromFile(): void {
    if (fs.existsSync(this.filePath)) {
      this.data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }
  }

  // Fetch data from Yahoo Finance
  private async fetchData(ticker: string): Promise<MarketDataEntry[]> {
    try {
      const startDate = "2021-01-01";
      const endDate = new Date().toISOString().split("T")[0]; // Set endDate to the current date
      const url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${
        new Date(startDate).getTime() / 1000
      }&period2=${
        new Date(endDate).getTime() / 1000
      }&interval=1d&events=history&includeAdjustedClose=true`;
      const response = await axios.get(url);
      const data: MarketDataEntry[] = response.data
        .split("\n")
        .slice(1)
        .map((line: string) => {
          const [date, open, high, low, close, adjClose, volume] =
            line.split(",");
          return { date, open, high, low, close, adjClose, volume };
        });
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      throw error;
    }
  }

  // Get market data for a specific symbol
  public async getMarketData(symbol: string): Promise<MarketDataEntry[]> {
    if (!this.data[symbol]) {
      this.data[symbol] = await this.fetchData(symbol);
      this.saveDataToFile();
      pubSub.publish("dataChanged", { symbol, data: this.data[symbol] });
    }
    return this.data[symbol];
  }

  // Save the updated data to the JSON file
  private saveDataToFile(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  // Fetch and save data for all tickers
  public async fetchAndSaveData(tickers: string[]): Promise<void> {
    try {
      for (const ticker of tickers) {
        console.log(`Fetching data for ${ticker}...`);
        this.data[ticker] = await this.fetchData(ticker);
      }
      this.saveDataToFile();
      pubSub.publish("dataChanged", { tickers, data: this.data });
      console.log("Data successfully saved to data.json");
    } catch (error) {
      console.error("Failed to fetch and save data:", error);
    }
  }
}
