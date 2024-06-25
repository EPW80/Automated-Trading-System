import { JSONDataAccess } from "./adapters/JSONDataAccess.js";

const tickers: string[] = ["SOXL", "SOXS"];
const jsonDataAccess = new JSONDataAccess();

(async () => {
  try {
    await jsonDataAccess.fetchAndSaveData(tickers);
    console.log("Data fetching and saving completed successfully.");
  } catch (error) {
    console.error("An error occurred while fetching and saving data:", error);
  }
})();
