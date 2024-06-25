// Import the necessary modules and interfaces
import { IDataAccess, MarketDataEntry } from "./IDataAccess";
import { JSONDataAccess } from "./JSONDataAccess";

// Define a class that implements the IDataAccess interface
export class JSONDataAdapter implements IDataAccess<MarketDataEntry> {
  private adaptee: JSONDataAccess;

  // Constructor that takes an instance of the JSONDataAccess class
  constructor(adaptee: JSONDataAccess) {
    this.adaptee = adaptee;
  }

  // Async request method that calls the getMarketData method of the adaptee
  async request(symbol: string): Promise<MarketDataEntry[]> {
    return await this.adaptee.getMarketData(symbol);
  }
}
