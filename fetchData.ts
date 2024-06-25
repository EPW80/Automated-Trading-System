
import { JSONDataAccess } from "./adapters/JSONDataAccess.js";

const tickers: string[] = ["SOXL", "SOXS"];
const jsonDataAccess = new JSONDataAccess();

(async () => {
  await jsonDataAccess.fetchAndSaveData(tickers);
})();
