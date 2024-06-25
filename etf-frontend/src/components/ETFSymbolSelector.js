import React, { useState } from "react";
import axios from "axios";
import { pubSub } from "../pubsub/PubSub.js";
import "../App.css"; // Import the CSS file

const ETFSymbolSelector = () => {
  // State variables to manage form inputs and loading/error states
  const [symbol, setSymbol] = useState("SOXL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    try {
      // Send a POST request to fetch data
      const response = await axios.post("http://localhost:5000/getData", {
        symbol,
        startDate,
        endDate,
      });

      // Publish data changes using pubSub
      pubSub.publish("dataChanged", { symbol, data: response.data });
    } catch (error) {
      // Handle any errors that occur during data fetching
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    // Form for selecting ETF symbol and date range
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

      {/* Display error message if there is an error */}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default ETFSymbolSelector;
