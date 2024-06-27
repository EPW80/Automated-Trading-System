import fs from "fs";
import { MarketDataEntry } from "./marketDataInterfaces.js";
import { runTradingStrategy } from "./runTradingStrategy.js";
import { generateCSVLogFile } from "./generateCSVLogFile.js";

(async () => {
  try {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    const marketData: MarketDataEntry[] = data["SOXL"];
    const initialBalance = 100000;
    const shortWindow = 10;
    const longWindow = 50;

    const result = runTradingStrategy(
      marketData,
      shortWindow,
      longWindow,
      initialBalance
    );
    const {
      balance,
      transactions,
      totalGainOrLoss,
      percentageReturn,
      finalBalance,
    } = result;
    console.log(`Total Gain/Loss: $${totalGainOrLoss.toFixed(2)}`);
    console.log(`Percentage Return: ${percentageReturn.toFixed(2)}%`);
    console.log(`Final Balance: $${finalBalance.toFixed(2)}`);

    generateCSVLogFile(transactions, {
      totalGainOrLoss,
      percentageReturn,
      finalBalance,
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
