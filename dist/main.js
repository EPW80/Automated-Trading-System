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
import { runTradingStrategy } from "./runTradingStrategy.js";
import { generateCSVLogFile } from "./generateCSVLogFile.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
        const marketData = data["SOXL"];
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
