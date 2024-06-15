// calculateSMA.test.ts
import { calculateSMA, MarketDataEntry } from '../strategy';

describe('calculateSMA', () => {
  it('should correctly calculate the SMA for a given window size', () => {
    const data: MarketDataEntry[] = [
      { date: '2021-01-01', open: '100', high: '110', low: '90', close: '105', adjClose: '105', volume: '1000' },
      { date: '2021-01-02', open: '105', high: '115', low: '95', close: '110', adjClose: '110', volume: '1100' },
      { date: '2021-01-03', open: '110', high: '120', low: '100', close: '115', adjClose: '115', volume: '1200' },
      { date: '2021-01-04', open: '115', high: '125', low: '105', close: '120', adjClose: '120', volume: '1300' },
      { date: '2021-01-05', open: '120', high: '130', low: '110', close: '125', adjClose: '125', volume: '1400' },
    ];
    const windowSize = 3;
    const expectedSMA = [null, null, 110, 115, 120]; // The first two values are null because there's not enough data to calculate the SMA

    const result = calculateSMA(data, windowSize);
    expect(result).toEqual(expectedSMA);
  });
});
