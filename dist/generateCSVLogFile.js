import fs from "fs";
import { parse } from "json2csv";
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
