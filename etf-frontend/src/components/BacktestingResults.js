import React from "react";
import "../App.css";

const BacktestingResults = ({ results }) => {
  if (!results) return null;

  const totalGainOrLoss = results.totalGainOrLoss
    ? results.totalGainOrLoss.toFixed(2)
    : "0.00";
  const percentageReturn = results.percentageReturn
    ? results.percentageReturn.toFixed(2)
    : "0.00";
  const finalBalance = results.finalBalance
    ? results.finalBalance.toFixed(2)
    : "0.00";

  const summaryRow = {
    date: "Summary",
    type: "",
    shares: "",
    price: "",
    gainOrLoss: results.totalGainOrLoss || 0,
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Backtesting Results</h2>
      </div>
      <div className="transactions-section">
        <h3>Transactions:</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Shares</th>
              <th>Price</th>
              <th>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {results.transactions.map((tx, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{tx.date}</td>
                <td>{tx.type}</td>
                <td>{tx.shares}</td>
                <td>${tx.price.toFixed(2)}</td>
                <td>${tx.gainOrLoss.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="summary-row">
              <td>{summaryRow.date}</td>
              <td>{summaryRow.type}</td>
              <td>{summaryRow.shares}</td>
              <td>{summaryRow.price}</td>
              <td>${summaryRow.gainOrLoss.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="summary-container">
        <h3>Summary</h3>
        <div className="summary-table">
          <div className="summary-row">
            <span className="summary-label">Initial Balance:</span>
            <span className="summary-value">$100,000.00</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Final Balance:</span>
            <span className="summary-value">${finalBalance}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Total Gain/Loss:</span>
            <span className="summary-value">${totalGainOrLoss}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Percentage Return:</span>
            <span className="summary-value">{percentageReturn}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestingResults;
