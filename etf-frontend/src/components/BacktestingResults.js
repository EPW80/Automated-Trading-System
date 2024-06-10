import React from 'react';

const BacktestingResults = ({ results }) => {
  if (!results) return null;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ marginTop: '1rem' }}>
        <h2>Backtesting Results</h2>
        <p>Total Gain/Loss: ${results.totalGainOrLoss.toFixed(2)}</p>
        <p>Percentage Return: {results.percentageReturn.toFixed(2)}%</p>
        <h3>Transactions:</h3>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#282c34', color: 'white' }}>
              <th style={{ padding: '0.5rem' }}>Date</th>
              <th style={{ padding: '0.5rem' }}>Type</th>
              <th style={{ padding: '0.5rem' }}>Shares</th>
              <th style={{ padding: '0.5rem' }}>Price</th>
              <th style={{ padding: '0.5rem' }}>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {results.transactions.map((tx, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : 'white' }}>
                <td style={{ padding: '0.5rem' }}>{tx.date}</td>
                <td style={{ padding: '0.5rem' }}>{tx.type}</td>
                <td style={{ padding: '0.5rem' }}>{tx.shares}</td>
                <td style={{ padding: '0.5rem' }}>${tx.price.toFixed(2)}</td>
                <td style={{ padding: '0.5rem' }}>${tx.gainOrLoss.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BacktestingResults;
