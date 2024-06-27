import { MarketDataEntry, Trade } from "./marketDataInterfaces";
import { calculateSMA } from "./calculateSMA.js";

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
  finalBalance: number;
} {
  let balance = initialBalance;
  let sharesOwned = 0;
  let transactions: Trade[] = [];
  let totalGainOrLoss = 0;
  let purchasePrice = 0;

  const shortSMA = calculateSMA(data, shortWindow);
  const longSMA = calculateSMA(data, longWindow);

  for (let i = longWindow - 1; i < data.length; i++) {
    const entry = data[i];
    const { date, open, high, low, close, adjClose } = entry;
    const price = parseFloat(close);

    if (shortSMA[i] !== null && longSMA[i] !== null) {
      if (shortSMA[i]! > longSMA[i]! && shortSMA[i - 1]! <= longSMA[i - 1]!) {
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
      } else if (
        shortSMA[i]! < longSMA[i]! &&
        shortSMA[i - 1]! >= longSMA[i - 1]!
      ) {
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
  const finalBalance =
    balance + sharesOwned * parseFloat(data[data.length - 1].close);

  return {
    balance,
    sharesOwned,
    transactions,
    totalGainOrLoss,
    percentageReturn,
    finalBalance,
  };
}
