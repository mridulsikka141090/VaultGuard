import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { db } from "../../src/firebase/index.js";
console.log("Stock API Key:", process.env.STOCK_API_KEY); // Check if the key is loaded correctly

const stockApiKey = process.env.STOCK_API_KEY;
const fetchStockSymbols = async () => {
  try {
    const apiUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${stockApiKey}`;
    const response = await axios.get(apiUrl);
    const symbols = response.data;
    if (symbols.length === 0) {
      console.log("No stock symbols found.");
      return;
    }
    console.log(
      `Found ${symbols.length} stock symbols. Checking for new stocks...`
    );
    // Create a batch
    let batch = db.batch();
    let operationsCount = 0;
    for (const symbol of symbols) {
      const stockRef = db.collection("stocks").doc(symbol.symbol);
      const doc = await stockRef.get();
      if (!doc.exists) {
        batch.set(stockRef, {
          country: "US",
          symbol: symbol.symbol,
          name: symbol.description,
          type: symbol.type,
          currency: symbol.currency,
        });
        operationsCount++;
      } else {
        console.log(`Stock already exists: ${symbol.symbol}`);
      }
      if (operationsCount >= 500) {
        // Firestore's batch limit is 500 operations
        await batch.commit();
        console.log("Batch committed.");
        batch = db.batch();
        operationsCount = 0;
      }
    }
    // Commit the remaining batch
    if (operationsCount > 0) {
      await batch.commit();
      console.log("Final batch committed.");
    }
    console.log("Stock fetch and update completed.");
  } catch (error) {
    console.error("Error fetching stock symbols from Finnhub:", error);
  }
};
// Run the function
fetchStockSymbols();
