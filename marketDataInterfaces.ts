export interface MarketDataEntry {
    date: string;
    open: string;
    high: string;
    low: string;
    close: string;
    adjClose: string;
    volume: string;
  }
  
  export interface Trade {
    date: string;
    type: string;
    price: number;
    shares: number;
    gainOrLoss: number;
    balance: number;
    open: number;
    high: number;
    low: number;
    adjClose: number;
  }
  