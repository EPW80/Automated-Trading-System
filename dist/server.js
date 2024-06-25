var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/controllers/server.ts
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { runTradingStrategy, generateCSVLogFile, } from "./strategy.js";
import { JSONDataAccess } from "./adapters/JSONDataAccess.js";
import { JSONDataAdapter } from "./adapters/JSONDataAdapter.js";
import { pubSub } from "./pubsub/PubSub.js"; // Import the pubSub
// Create an instance of the data access class
const jsonDataAccess = new JSONDataAccess();
const dataAccess = new JSONDataAdapter(jsonDataAccess);
// Create an Express application
const app = express();
const PORT = 5000;
// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
// Route to get filtered market data based on symbol and date range
app.post("/getData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol, startDate, endDate } = req.body;
    try {
        // Get market data using the data access layer
        const marketData = yield dataAccess.request(symbol);
        const filteredData = marketData.filter((entry) => new Date(entry.date) >= new Date(startDate) &&
            new Date(entry.date) <= new Date(endDate));
        // Publish the data change event
        pubSub.publish("dataChanged", { symbol, data: filteredData });
        // Send filtered market data as JSON response
        res.json(filteredData);
    }
    catch (error) {
        console.error("Error fetching market data:", error);
        res.status(500).send("Error fetching market data");
    }
}));
// Route to run the trading strategy
app.post("/runStrategy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol, shortWindow, longWindow, initialBalance } = req.body;
    try {
        // Get market data using the data access layer
        const marketData = yield dataAccess.request(symbol);
        // Run the trading strategy
        const result = runTradingStrategy(marketData, shortWindow, longWindow, initialBalance);
        const { transactions, totalGainOrLoss, percentageReturn, finalBalance } = result;
        // Generate a CSV log file for the transactions
        generateCSVLogFile(transactions, {
            totalGainOrLoss,
            percentageReturn,
            finalBalance,
        });
        // Publish the data change event
        pubSub.publish("dataChanged", { symbol, data: marketData });
        // Send the result as JSON response
        res.json(result);
    }
    catch (error) {
        console.error("Error running trading strategy:", error);
        res.status(500).send("Error running trading strategy");
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
