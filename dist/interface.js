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
// Main function to run the program
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const inquirer = yield import("inquirer");
        // Prompt the user to select a symbol
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
        // Prompt the user to decide if they want to generate a graph
        const { generateGraph } = yield inquirer.default.prompt([
            {
                type: "confirm",
                name: "generateGraph",
                message: "Would you like to generate a price graph?",
            },
        ]);
        if (generateGraph) {
            // Prompt the user to enter the start and end dates for the graph
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
/**
 * Generates a price chart for the specified symbol between the given dates.
 * @param {string} symbol - The symbol to generate the chart for.
 * @param {string} startDate - The start date for the chart data.
 * @param {string} endDate - The end date for the chart data.
 */
function generateChart(symbol, startDate, endDate) {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    const marketData = data[symbol].filter((entry) => new Date(entry.date) >= new Date(startDate) &&
        new Date(entry.date) <= new Date(endDate));
    const dates = marketData.map((entry) => entry.date);
    const prices = marketData.map((entry) => parseFloat(entry.close)); // Ensure prices are numbers
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
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(75, 192, 192, 1)",
                    pointBorderColor: "#fff",
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${symbol} Price Chart`,
                    font: {
                        size: 18,
                        family: "'Roboto', sans-serif",
                        weight: "bold",
                    },
                    color: "#333",
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || "";
                            if (label) {
                                label += ": ";
                            }
                            label += parseFloat(context.parsed.y).toFixed(2);
                            return label;
                        },
                    },
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 14,
                            family: "'Roboto', sans-serif",
                        },
                        color: "#333",
                    },
                },
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day",
                    },
                    title: {
                        display: true,
                        text: "Date",
                        font: {
                            size: 16,
                            family: "'Roboto', sans-serif",
                        },
                        color: "#333",
                    },
                    ticks: {
                        color: "#333",
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Price",
                        font: {
                            size: 16,
                            family: "'Roboto', sans-serif",
                        },
                        color: "#333",
                    },
                    ticks: {
                        color: "#333",
                    },
                },
            },
        },
    });
    fs.writeFileSync("chart.png", canvas.toBuffer("image/png"));
    console.log("Price graph saved as chart.png");
}
main();
