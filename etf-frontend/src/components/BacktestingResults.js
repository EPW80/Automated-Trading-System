import React from "react";

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
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div style={{ marginTop: "1rem" }}>
        <h2>Backtesting Results</h2>
        <p>Total Gain/Loss: ${totalGainOrLoss}</p>
        <p>Percentage Return: {percentageReturn}%</p>
        <h3>Transactions:</h3>
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#282c34", color: "white" }}>
              <th style={{ padding: "0.5rem" }}>Date</th>
              <th style={{ padding: "0.5rem" }}>Type</th>
              <th style={{ padding: "0.5rem" }}>Shares</th>
              <th style={{ padding: "0.5rem" }}>Price</th>
              <th style={{ padding: "0.5rem" }}>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {results.transactions.map((tx, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f0f8ff" : "white",
                }}
              >
                <td style={{ padding: "0.5rem" }}>{tx.date}</td>
                <td style={{ padding: "0.5rem" }}>{tx.type}</td>
                <td style={{ padding: "0.5rem" }}>{tx.shares}</td>
                <td style={{ padding: "0.5rem" }}>${tx.price.toFixed(2)}</td>
                <td style={{ padding: "0.5rem" }}>
                  ${tx.gainOrLoss.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: "#d3d3d3" }}>
              <td style={{ padding: "0.5rem" }}>{summaryRow.date}</td>
              <td style={{ padding: "0.5rem" }}>{summaryRow.type}</td>
              <td style={{ padding: "0.5rem" }}>{summaryRow.shares}</td>
              <td style={{ padding: "0.5rem" }}>{summaryRow.price}</td>
              <td style={{ padding: "0.5rem" }}>
                ${summaryRow.gainOrLoss.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "2rem" }}>
          <h3>Summary</h3>
          <p>Initial Balance: $100,000.00</p>
          <p>Final Balance: ${finalBalance}</p>
          <p>Total Gain/Loss: ${totalGainOrLoss}</p>
          <p>Percentage Return: {percentageReturn}%</p>
        </div>
      </div>
    </div>
  );
};

export default BacktestingResults;
