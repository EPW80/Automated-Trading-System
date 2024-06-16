import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import { runTradingStrategy, generateCSVLogFile, } from "./strategy.js";
// Load the data from the JSON file
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
// Create an Express application
const app = express();
const PORT = 5000;
// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
// Route to get filtered market data based on symbol and date range
app.post("/getData", (req, res) => {
    const { symbol, startDate, endDate } = req.body;
    // Filter market data based on the date range
    const marketData = data[symbol].filter((entry) => new Date(entry.date) >= new Date(startDate) &&
        new Date(entry.date) <= new Date(endDate));
    // Send filtered market data as JSON response
    res.json(marketData);
});
// Route to run the trading strategy
app.post("/runStrategy", (req, res) => {
    const { symbol, shortWindow, longWindow, initialBalance } = req.body;
    // Get market data for the specified symbol
    const marketData = data[symbol];
    // Run the trading strategy
    const result = runTradingStrategy(marketData, shortWindow, longWindow, initialBalance);
    const { transactions, totalGainOrLoss, percentageReturn, finalBalance } = result;
    // Generate a CSV log file for the transactions
    generateCSVLogFile(transactions, {
        totalGainOrLoss,
        percentageReturn,
        finalBalance,
    });
    // Send the result as JSON response
    res.json(result);
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
