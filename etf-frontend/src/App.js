import React, { useState } from "react";
import ETFSymbolSelector from "./components/ETFSymbolSelector";
import ChartComponent from "./components/ChartComponent";
import BarChartComponent from "./components/BarChartComponent";
import BacktestingResults from "./components/BacktestingResults";
import "./App.css";
import axios from "axios";

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [backtestResults, setBacktestResults] = useState(null);

  const handleRunBacktest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/runStrategy", {
        symbol: "SOXL",
        shortWindow: 10,
        longWindow: 50,
        initialBalance: 100000,
      });
      setBacktestResults(response.data);
    } catch (error) {
      console.error("Error running backtest", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SOX STOX</h1>
        <h5>(soxl and soxs automated trading)</h5>
      </header>
      <main>
        <ETFSymbolSelector setChartData={setChartData} />
        {chartData.length > 0 && (
          <div className="charts-container">
            <div className="chart-wrapper">
              <ChartComponent data={chartData} />
            </div>
            <div className="chart-wrapper">
              <BarChartComponent data={chartData} />
            </div>
          </div>
        )}
        <button
          onClick={handleRunBacktest}
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#61dafb",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
            marginTop: "1rem",
          }}
        >
          Run Backtest
        </button>
        {backtestResults && <BacktestingResults results={backtestResults} />}
      </main>
    </div>
  );
};

export default App;
