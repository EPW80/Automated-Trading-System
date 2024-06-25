// src/controllers/server.ts
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  runTradingStrategy,
  MarketDataEntry,
  generateCSVLogFile,
} from "./strategy.js";
import { IDataAccess } from "./adapters/IDataAccess.js";
import { JSONDataAccess } from "./adapters/JSONDataAccess.js";
import { JSONDataAdapter } from "./adapters/JSONDataAdapter.js";

// Create an instance of the data access class
const jsonDataAccess = new JSONDataAccess();
const dataAccess: IDataAccess<MarketDataEntry> = new JSONDataAdapter(
  jsonDataAccess
);

// Create an Express application
const app = express();
const PORT = 5000;

// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Route to get filtered market data based on symbol and date range
app.post("/getData", async (req, res) => {
  const { symbol, startDate, endDate } = req.body;

  try {
    // Get market data using the data access layer
    const marketData = await dataAccess.request(symbol);
    const filteredData = marketData.filter(
      (entry: MarketDataEntry) =>
        new Date(entry.date) >= new Date(startDate) &&
        new Date(entry.date) <= new Date(endDate)
    );

    // Send filtered market data as JSON response
    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    res.status(500).send("Error fetching market data");
  }
});

// Route to run the trading strategy
app.post("/runStrategy", async (req, res) => {
  const { symbol, shortWindow, longWindow, initialBalance } = req.body;

  try {
    // Get market data using the data access layer
    const marketData = await dataAccess.request(symbol);

    // Run the trading strategy
    const result = runTradingStrategy(
      marketData,
      shortWindow,
      longWindow,
      initialBalance
    );

    const { transactions, totalGainOrLoss, percentageReturn, finalBalance } =
      result;

    // Generate a CSV log file for the transactions
    generateCSVLogFile(transactions, {
      totalGainOrLoss,
      percentageReturn,
      finalBalance,
    });

    // Send the result as JSON response
    res.json(result);
  } catch (error) {
    console.error("Error running trading strategy:", error);
    res.status(500).send("Error running trading strategy");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
