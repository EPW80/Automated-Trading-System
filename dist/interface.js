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
import { createCanvas } from "canvas";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
// Load the data from the JSON file
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const inquirer = yield import("inquirer");
        const { symbol } = yield inquirer.default.prompt([
            {
                type: "list",
                name: "symbol",
                message: "Choose the symbol",
                choices: ["SOXL", "SOXS"],
            },
        ]);
        console.log(`You selected: ${symbol}`);
        console.log(`Description: ${symbol} is an ETF focused on semiconductor companies with 3x leverage.`);
        const recentData = data[symbol];
        const lastEntry = recentData[recentData.length - 1];
        const prevEntry = recentData[recentData.length - 2];
        console.log(`Most recent date: ${lastEntry.date}`);
        console.log(`Most recent price: ${lastEntry.close}`);
        const percentageChange = ((parseFloat(lastEntry.close) - parseFloat(prevEntry.close)) /
            parseFloat(prevEntry.close)) *
            100;
        console.log(`Percentage change from previous date: ${percentageChange.toFixed(2)}%`);
        const { generateGraph } = yield inquirer.default.prompt([
            {
                type: "confirm",
                name: "generateGraph",
                message: "Would you like to generate a price graph?",
            },
        ]);
        if (generateGraph) {
            const { startDate, endDate } = yield inquirer.default.prompt([
                {
                    type: "input",
                    name: "startDate",
                    message: "Enter the start date (YYYY-MM-DD):",
                    validate: (input) => /\d{4}-\d{2}-\d{2}/.test(input)
                        ? true
                        : "Invalid date format. Use YYYY-MM-DD.",
                },
                {
                    type: "input",
                    name: "endDate",
                    message: "Enter the end date (YYYY-MM-DD):",
                    validate: (input) => /\d{4}-\d{2}-\d{2}/.test(input)
                        ? true
                        : "Invalid date format. Use YYYY-MM-DD.",
                },
            ]);
            generateChart(symbol, startDate, endDate);
        }
    });
}
function generateChart(symbol, startDate, endDate) {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    const marketData = data[symbol].filter((entry) => new Date(entry.date) >= new Date(startDate) &&
        new Date(entry.date) <= new Date(endDate));
    const dates = marketData.map((entry) => entry.date);
    const prices = marketData.map((entry) => entry.close);
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext("2d");
    new Chart(canvas, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: `${symbol} Price`,
                    data: prices,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day",
                    },
                },
            },
        },
    });
    fs.writeFileSync("chart.png", canvas.toBuffer("image/png"));
    console.log("Price graph saved as chart.png");
}
main();
