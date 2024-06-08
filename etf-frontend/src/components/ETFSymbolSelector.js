import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // Make sure to import your CSS file

const ETFSymbolSelector = ({ setChartData }) => {
  const [symbol, setSymbol] = useState("SOXL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/getData", {
        symbol,
        startDate,
        endDate,
      });
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Symbol:
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value="SOXL">SOXL</option>
          <option value="SOXS">SOXS</option>
        </select>
      </label>
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button type="submit">Fetch Data</button>
    </form>
  );
};

export default ETFSymbolSelector;
