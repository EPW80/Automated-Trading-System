// src/adapters/JSONDataAccess.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import fs from "fs";
import path from "path";
import { pubSub } from "../pubsub/PubSub.js"; // Import the pubsub instance
// Define a class that implements the IDataAccess interface
export class JSONDataAccess {
    constructor() {
        this.data = {};
        this.filePath = path.join(process.cwd(), "data.json");
        this.loadDataFromFile();
    }
    // Load data from the JSON file if it exists
    loadDataFromFile() {
        if (fs.existsSync(this.filePath)) {
            this.data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
        }
    }
    // Fetch data from Yahoo Finance
    fetchData(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = "2021-01-01";
                const endDate = new Date().toISOString().split("T")[0]; // Set endDate to the current date
                const url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}&interval=1d&events=history&includeAdjustedClose=true`;
                const response = yield axios.get(url);
                const data = response.data
                    .split("\n")
                    .slice(1)
                    .map((line) => {
                    const [date, open, high, low, close, adjClose, volume] = line.split(",");
                    return { date, open, high, low, close, adjClose, volume };
                });
                return data;
            }
            catch (error) {
                console.error(`Error fetching data for ${ticker}:`, error);
                throw error;
            }
        });
    }
    // Get market data for a specific symbol
    getMarketData(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.data[symbol]) {
                this.data[symbol] = yield this.fetchData(symbol);
                this.saveDataToFile();
                pubSub.publish("dataChanged", { symbol, data: this.data[symbol] });
            }
            return this.data[symbol];
        });
    }
    // Save the updated data to the JSON file
    saveDataToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    }
    // Fetch and save data for all tickers
    fetchAndSaveData(tickers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const ticker of tickers) {
                    console.log(`Fetching data for ${ticker}...`);
                    this.data[ticker] = yield this.fetchData(ticker);
                }
                this.saveDataToFile();
                pubSub.publish("dataChanged", { tickers, data: this.data });
                console.log("Data successfully saved to data.json");
            }
            catch (error) {
                console.error("Failed to fetch and save data:", error);
            }
        });
    }
}
