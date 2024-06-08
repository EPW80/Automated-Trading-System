import React, { useState } from 'react';
import ETFSymbolSelector from './components/ETFSymbolSelector';
import ChartComponent from './components/ChartComponent';
import './App.css';

const App = () => {
  const [chartData, setChartData] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SOX STOX</h1>
      </header>
      <main>
        <ETFSymbolSelector setChartData={setChartData} />
        {chartData.length > 0 && <ChartComponent data={chartData} />}
      </main>
    </div>
  );
};

export default App;