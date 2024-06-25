// src/adapters/IDataAccess.ts
export interface MarketDataEntry {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjClose: string;
  volume: string;
}

export interface IDataAccess<T> {
  request(symbol: string): Promise<T[]>;
}
