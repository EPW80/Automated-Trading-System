# ETF Atoumated trading application

Automated trading system specifically designed to trade two exchange-traded funds (ETFs): SOXL and SOXS. These ETFs are highly volatile because they are 3x leveraged. The top holdings of these ETFs primarily consist of semiconductor companies, including NVIDIA (NVDA), Broadcom (AVGO), Advanced Micro Devices (AMD), Qualcomm (QCOM), Micron Technology (MU), Intel (INTC), and Microchip Technology (MCHP).

If the majority of these holdings are up, SOXL will rise, while SOXS will fall, and vice versa. In other words, the price movements of SOXL and SOXS are inversely related. Therefore, you can buy and sell one of them for a profit, provided you can accurately predict the direction of their movements without relying on short selling.

## Installation based on WSL environment

### Run Program Using Node.js

- The fetchData.js file can run using Node.js to execute program. Here’s how you can do it:

- Open terminal.
- Navigate to the directory containing your fetchData.js file.
- Run the following command:

```sudo node fetchData.js```

- Compile and Run the server:

```sudo tsc```

```sudo node dist/interface.js```
