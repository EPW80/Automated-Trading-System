import React, { useState } from 'react';
import axios from 'axios';

const BacktestingResults = () => {
  const [results, setResults] = useState(null);

  const handleRunBacktest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/runStrategy', {
        symbol: 'SOXL',
        shortWindow: 10,
        longWindow: 50,
        initialBalance: 100000,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error running backtest', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <button
        onClick={handleRunBacktest}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#61dafb',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          marginTop: '1rem',
        }}
      >
        Run Backtest
      </button>
      {results && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Backtesting Results</h2>
          <p>Total Gain/Loss: ${results.totalGainOrLoss.toFixed(2)}</p>
          <p>Percentage Return: {results.percentageReturn.toFixed(2)}%</p>
          <h3>Transactions:</h3>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {results.transactions.map((tx, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                {tx.date}: {tx.type} {tx.shares} shares at ${tx.price.toFixed(2)} (Gain/Loss: ${tx.gainOrLoss.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BacktestingResults;
