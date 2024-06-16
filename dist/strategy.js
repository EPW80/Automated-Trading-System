var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import { parse } from "json2csv";
// Function to calculate Simple Moving Average (SMA)
export function calculateSMA(data, windowSize) {
    let sum = 0;
    const sma = new Array(windowSize - 1).fill(null); // Fill the initial array with nulls
    // Calculate the sum for the first window
    for (let i = 0; i < windowSize; i++) {
        sum += parseFloat(data[i].close);
    }
    sma.push(sum / windowSize);
    // Calculate the rest using a rolling sum
    for (let i = windowSize; i < data.length; i++) {
        sum -= parseFloat(data[i - windowSize].close);
        sum += parseFloat(data[i].close);
        sma.push(sum / windowSize);
    }
    return sma;
}
// Function to run the trading strategy
export function runTradingStrategy(data, shortWindow, longWindow, initialBalance) {
    let balance = initialBalance;
    let sharesOwned = 0;
    let transactions = [];
    let totalGainOrLoss = 0;
    let purchasePrice = 0;
    const shortSMA = calculateSMA(data, shortWindow);
    const longSMA = calculateSMA(data, longWindow);
    for (let i = longWindow - 1; i < data.length; i++) {
        const entry = data[i];
        const { date, open, high, low, close, adjClose } = entry;
        const price = parseFloat(close);
        if (shortSMA[i] !== null && longSMA[i] !== null) {
            // Check for buy signal: short SMA crosses above long SMA
            if (shortSMA[i] > longSMA[i] && shortSMA[i - 1] <= longSMA[i - 1]) {
                const sharesToBuy = Math.floor(balance / price);
                if (sharesToBuy > 0) {
                    purchasePrice = price;
                    sharesOwned += sharesToBuy;
                    balance -= sharesToBuy * purchasePrice;
                    transactions.push({
                        date,
                        type: "buy",
                        price: purchasePrice,
                        shares: sharesToBuy,
                        gainOrLoss: 0,
                        balance,
                        open: parseFloat(open),
                        high: parseFloat(high),
                        low: parseFloat(low),
                        adjClose: parseFloat(adjClose),
                    });
                }
                // Check for sell signal: short SMA crosses below long SMA
            }
            else if (shortSMA[i] < longSMA[i] &&
                shortSMA[i - 1] >= longSMA[i - 1]) {
                if (sharesOwned > 0) {
                    const sellPrice = price;
                    const gainOrLoss = sharesOwned * (sellPrice - purchasePrice);
                    totalGainOrLoss += gainOrLoss;
                    balance += sharesOwned * sellPrice;
                    transactions.push({
                        date,
                        type: "sell",
                        price: sellPrice,
                        shares: sharesOwned,
                        gainOrLoss,
                        balance,
                        open: parseFloat(open),
                        high: parseFloat(high),
                        low: parseFloat(low),
                        adjClose: parseFloat(adjClose),
                    });
                    sharesOwned = 0;
                }
            }
        }
    }
    const percentageReturn = (totalGainOrLoss / initialBalance) * 100;
    const finalBalance = balance + sharesOwned * parseFloat(data[data.length - 1].close); // Include value of remaining shares
    return {
        balance,
        sharesOwned,
        transactions,
        totalGainOrLoss,
        percentageReturn,
        finalBalance,
    };
}
// Function to generate CSV log file
export function generateCSVLogFile(transactions, summary) {
    const fields = [
        "date",
        "type",
        "price",
        "shares",
        "gainOrLoss",
        "balance",
        "open",
        "high",
        "low",
        "adjClose",
    ];
    const csvData = parse(transactions, { fields });
    const summaryRow = `\nSummary,,,,${summary.totalGainOrLoss},${summary.percentageReturn},${summary.finalBalance},,,,`;
    fs.writeFileSync("trading_log.csv", csvData + summaryRow);
}
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
        const marketData = data["SOXL"]; // Use your desired symbol here
        const initialBalance = 100000;
        const shortWindow = 10;
        const longWindow = 50;
        const result = runTradingStrategy(marketData, shortWindow, longWindow, initialBalance);
        const { balance, transactions, totalGainOrLoss, percentageReturn, finalBalance, } = result;
        console.log(`Total Gain/Loss: $${totalGainOrLoss.toFixed(2)}`);
        console.log(`Percentage Return: ${percentageReturn.toFixed(2)}%`);
        console.log(`Final Balance: $${finalBalance.toFixed(2)}`);
        generateCSVLogFile(transactions, {
            totalGainOrLoss,
            percentageReturn,
            finalBalance,
        });
    }
    catch (error) {
        console.error("An error occurred:", error);
    }
}))();
