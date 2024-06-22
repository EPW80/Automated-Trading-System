# ETF Automated Trading application

This automated trading system is specifically designed to trade two exchange-traded funds (ETFs): SOXL and SOXS. These ETFs are highly volatile due to their 3x leverage. The top holdings of these ETFs primarily consist of semiconductor companies, including NVIDIA (NVDA), Broadcom (AVGO), Advanced Micro Devices (AMD), Qualcomm (QCOM), Micron Technology (MU), Intel (INTC), and Microchip Technology (MCHP).

If the majority of these holdings are up, SOXL will rise, while SOXS will fall, and vice versa. In other words, the price movements of SOXL and SOXS are inversely related. Therefore, you can buy and sell one of them for a profit, provided you can accurately predict the direction of their movements without relying on short selling.

## Features

- Automated Trading Strategy: Implements a Simple Moving Average (SMA) crossover strategy for trading SOXL and SOXS.
- Data Fetching: Fetches historical data for SOXL and SOXS from Yahoo Finance.
- Backtesting: Evaluates the performance of the trading strategy through backtesting.
- Interactive Frontend: Provides a user-friendly interface for selecting symbols, viewing data, and running backtests.
- Graphical Visualization: Displays price charts for the selected ETFs over a specified date range.

## Installation

### Prerequisites

- Node.js and npm installed on your system.
- A code editor like Visual Studio Code.
- Git installed on your system.

### Fetch historical data

- The fetchData.js script downloads historical data for SOXL and SOXS from Yahoo Finance and saves it in JSON format.

- Run the following command in the terminal to fetch the data:

`sudo node fetchData.js`

- Run the server(from root):

`sudo node dist/server.js`

- Run frontend

`cd etf-frontend`

`npm install`

`npm start`

### Access the application

- Open a web browser and navigate to <http://localhost:3000>

### Usage

 Select ETF Symbol:

- Use the dropdown to select either SOXL or SOXS.

 Enter Date Range:

- Provide the start and end dates for fetching historical data.

 View Data:

- Fetch and view the historical data for the selected ETF within the specified date range.

 Run Backtest:

- Execute the backtesting feature to evaluate the trading strategy's performance based on historical data.

 View Results:

- Check the backtesting results, including total gain/loss, percentage return, and detailed transaction history.

### Demo

[Application Demo](https://www.loom.com/share/ef116ccd1b5440e78bd01551af0e83ab?sid=d608e38d-9b75-4845-bbce-71d4c2b98cf5)
