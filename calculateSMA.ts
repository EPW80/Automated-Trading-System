import { MarketDataEntry } from "./marketDataInterfaces";

export function calculateSMA(
  data: MarketDataEntry[],
  windowSize: number
): (number | null)[] {
  let sum = 0;
  const sma: (number | null)[] = new Array(windowSize - 1).fill(null);

  for (let i = 0; i < windowSize; i++) {
    sum += parseFloat(data[i].close);
  }
  sma.push(sum / windowSize);

  for (let i = windowSize; i < data.length; i++) {
    sum -= parseFloat(data[i - windowSize].close);
    sum += parseFloat(data[i].close);
    sma.push(sum / windowSize);
  }

  return sma;
}
