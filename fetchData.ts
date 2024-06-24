
import { JSONDataAccess } from "./adapters/JSONDataAccess";

const tickers: string[] = ["SOXL", "SOXS"];
const jsonDataAccess = new JSONDataAccess();

(async () => {
  await jsonDataAccess.fetchAndSaveData(tickers);
})();
