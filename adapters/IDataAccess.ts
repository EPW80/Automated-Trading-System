// The `MarketDataEntry` interface represents a single entry of market data.
export interface MarketDataEntry {
  date: string; // The date of the data entry
  open: string; // The opening price for the asset on this date
  high: string; // The highest price the asset reached on this date
  low: string; // The lowest price the asset reached on this date
  close: string; // The closing price for the asset on this date
  adjClose: string; // The adjusted closing price for the asset on this date
  volume: string; // The volume of the asset that was traded on this date
}

// The `IDataAccess` interface represents a data access object (DAO).
// It defines a method for requesting data of a generic type `T`.
export interface IDataAccess<T> {
  // The `request` method takes a symbol representing an asset,
  // and returns a Promise that resolves with an array of data entries.
  request(symbol: string): Promise<T[]>;
}
