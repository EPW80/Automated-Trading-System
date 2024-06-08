// Function to calculate Simple Moving Average (SMA)
export function calculateSMA(data, windowSize) {
    let sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < windowSize - 1) {
            sma.push(NaN); // Not enough data to calculate SMA, use NaN or another default value
        }
        else {
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
export function runTradingStrategy(data, shortWindow, longWindow, initialBalance) {
    let balance = initialBalance;
    let sharesOwned = 0;
    let transactions = [];
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
        }
        else if (shortSMA[i] < longSMA[i] && shortSMA[i - 1] >= longSMA[i - 1]) {
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
