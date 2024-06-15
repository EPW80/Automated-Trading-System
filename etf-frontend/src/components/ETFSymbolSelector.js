import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // Make sure to import your CSS file

const ETFSymbolSelector = ({ setChartData }) => {
  const [symbol, setSymbol] = useState("SOXL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/getData", {
        symbol,
        startDate,
        endDate,
      });
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="symbol" className="form-label">
          Symbol:
        </label>
        <select
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="form-control"
        >
          <option value="SOXL">SOXL</option>
          <option value="SOXS">SOXS</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="start-date" className="form-label">
          Start Date:
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="end-date" className="form-label">
          End Date:
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Fetching..." : "Fetch Data"}
      </button>
    </form>
  );
};

export default ETFSymbolSelector;
