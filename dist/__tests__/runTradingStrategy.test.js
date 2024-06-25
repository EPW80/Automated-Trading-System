// runTradingStrategy.test.ts
import { runTradingStrategy } from '../strategy';
describe('runTradingStrategy', () => {
    it('should correctly execute the trading strategy and update balances and transactions', () => {
        const data = [
            { date: '2021-01-01', open: '100', high: '110', low: '90', close: '105', adjClose: '105', volume: '1000' },
            { date: '2021-01-02', open: '105', high: '115', low: '95', close: '110', adjClose: '110', volume: '1100' },
            { date: '2021-01-03', open: '110', high: '120', low: '100', close: '115', adjClose: '115', volume: '1200' },
            { date: '2021-01-04', open: '115', high: '125', low: '105', close: '120', adjClose: '120', volume: '1300' },
            { date: '2021-01-05', open: '120', high: '130', low: '110', close: '125', adjClose: '125', volume: '1400' },
            { date: '2021-01-06', open: '125', high: '135', low: '115', close: '130', adjClose: '130', volume: '1500' },
            { date: '2021-01-07', open: '130', high: '140', low: '120', close: '135', adjClose: '135', volume: '1600' },
        ];
        const shortWindow = 3;
        const longWindow = 5;
        const initialBalance = 100000;
        const result = runTradingStrategy(data, shortWindow, longWindow, initialBalance);
        const expectedTransactions = [
        // Based on the strategy, add expected buy/sell transactions here
        ];
        const expectedTotalGainOrLoss = 0; // Calculate expected total gain or loss
        const expectedPercentageReturn = 0; // Calculate expected percentage return
        const expectedFinalBalance = initialBalance; // Calculate expected final balance
        expect(result.transactions).toEqual(expectedTransactions);
        expect(result.totalGainOrLoss).toBeCloseTo(expectedTotalGainOrLoss, 2);
        expect(result.percentageReturn).toBeCloseTo(expectedPercentageReturn, 2);
        expect(result.finalBalance).toBeCloseTo(expectedFinalBalance, 2);
    });
});
