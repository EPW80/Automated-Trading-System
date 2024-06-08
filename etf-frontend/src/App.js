import React, { useState } from 'react';
import ETFSymbolSelector from './components/ETFSymbolSelector';
import ChartComponent from './components/ChartComponent';
import BacktestingResults from './components/BacktestingResults';
import './App.css';
import axios from 'axios';

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [backtestResults, setBacktestResults] = useState(null);

  const handleRunBacktest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/runStrategy', {
        symbol: 'SOXL',
        shortWindow: 10,
        longWindow: 50,
        initialBalance: 100000
      });
      setBacktestResults(response.data);
    } catch (error) {
      console.error('Error running backtest', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SOX STOX</h1>
      </header>
      <main>
        <ETFSymbolSelector setChartData={setChartData} />
        {chartData.length > 0 && <ChartComponent data={chartData} />}
        <button onClick={handleRunBacktest}>Run Backtest</button>
        {backtestResults && <BacktestingResults results={backtestResults} />}
      </main>
    </div>
  );
};

export default App;
