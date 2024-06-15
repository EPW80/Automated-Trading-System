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
// Define the tickers
const tickers = ["SOXL", "SOXS"];
// Define the date range
const startDate = "2021-01-01";
const endDate = new Date().toISOString().split("T")[0]; // Set endDate to the current date
// Function to fetch data from Yahoo Finance
function fetchData(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
// Download the data
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        for (const ticker of tickers) {
            console.log(`Fetching data for ${ticker}...`);
            data[ticker] = yield fetchData(ticker);
        }
        // Save the data in JSON format in the root directory
        const filePath = path.join(process.cwd(), "data.json");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("Data successfully saved to data.json");
    }
    catch (error) {
        console.error("Failed to fetch and save data:", error);
    }
}))();
