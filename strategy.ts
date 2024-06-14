import fs from 'fs';
import { parse } from 'json2csv';

export interface MarketDataEntry {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjClose: string;
  volume: string;
}

export interface Trade {
  date: string;
  type: string;
  price: number;
  shares: number;
  gainOrLoss: number;
}

// Function to calculate Simple Moving Average (SMA)
export function calculateSMA(data: MarketDataEntry[], windowSize: number): number[] {
  let sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      sma.push(NaN); // Not enough data to calculate SMA, use NaN or another default value
    } else {
      let sum = 0;
      for (let j = i; j > i - windowSize; j--) {
        sum += parseFloat(data[j].close);
      }
      sma.push(sum / windowSize);
    }
  }
  return sma;
}

// Function to run the trading strategy
export function runTradingStrategy(
  data: MarketDataEntry[],
  shortWindow: number,
  longWindow: number,
  initialBalance: number
): {
  balance: number;
  sharesOwned: number;
  transactions: Trade[];
  totalGainOrLoss: number;
  percentageReturn: number;
} {
  let balance = initialBalance;
  let sharesOwned = 0;
  let transactions: Trade[] = [];
  let totalGainOrLoss = 0;
  let purchasePrice = 0;

  const shortSMA = calculateSMA(data, shortWindow);
  const longSMA = calculateSMA(data, longWindow);

  for (let i = longWindow - 1; i < data.length; i++) {
    if (shortSMA[i] > longSMA[i] && shortSMA[i - 1] <= longSMA[i - 1]) {
      // Buy signal
      let sharesToBuy = Math.floor(balance / parseFloat(data[i].close));
      if (sharesToBuy > 0) {
        purchasePrice = parseFloat(data[i].close);
        sharesOwned += sharesToBuy;
        balance -= sharesToBuy * purchasePrice;
        transactions.push({
          date: data[i].date,
          type: "buy",
          price: purchasePrice,
          shares: sharesToBuy,
          gainOrLoss: 0,
        });
      }
    } else if (shortSMA[i] < longSMA[i] && shortSMA[i - 1] >= longSMA[i - 1]) {
      // Sell signal
      if (sharesOwned > 0) {
        const sellPrice = parseFloat(data[i].close);
        const gainOrLoss = sharesOwned * (sellPrice - purchasePrice);
        totalGainOrLoss += gainOrLoss;
        balance += sharesOwned * sellPrice;
        transactions.push({
          date: data[i].date,
          type: "sell",
          price: sellPrice,
          shares: sharesOwned,
          gainOrLoss,
        });
        sharesOwned = 0;
      }
    }
  }

  const percentageReturn = (totalGainOrLoss / initialBalance) * 100;

  return {
    balance,
    sharesOwned,
    transactions,
    totalGainOrLoss,
    percentageReturn,
  };
}

// Function to generate CSV log file
export function generateCSVLogFile(transactions: Trade[], summary: { totalGainOrLoss: number; percentageReturn: number; balance: number }) {
  const fields = ["date", "type", "price", "shares", "gainOrLoss", "balance"];
  const csvData = parse(transactions, { fields });
  const summaryRow = `\nSummary,,,,${summary.totalGainOrLoss},${summary.percentageReturn},${summary.balance}`;
  fs.writeFileSync("trading_log.csv", csvData + summaryRow);
}

// Example usage
(async () => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  const marketData = data["SOXL"]; // Use your desired symbol here
  const initialBalance = 100000;
  const shortWindow = 10;
  const longWindow = 50;

  const result = runTradingStrategy(marketData, shortWindow, longWindow, initialBalance);
  const { balance, transactions, totalGainOrLoss, percentageReturn } = result;
  console.log(`Total Gain/Loss: $${totalGainOrLoss.toFixed(2)}`);
  console.log(`Percentage Return: ${percentageReturn.toFixed(2)}%`);
  console.log(`Final Balance: $${balance.toFixed(2)}`);

  generateCSVLogFile(transactions, { totalGainOrLoss, percentageReturn, balance });
})();
