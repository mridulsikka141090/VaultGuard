import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "../src/firebase/index.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Route to get stocks
app.get("/api/stocks", async (req, res) => {
  const { symbol } = req.query; // Get the symbol from query params

  try {
    // Reference to the "stocks" collection in Firestore
    const stockRef = db.collection("stocks");
    let query = stockRef;

    // If a symbol is provided, filter by the symbol
    if (symbol) {
      query = query.where("symbol", "==", symbol);
    }

    // Fetch the stock data from Firestore
    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No stocks found" });
    }

    // Map the fetched documents to an array of stock data
    const stocks = snapshot.docs.map((doc) => doc.data());

    console.log(`Currently showing ${stocks.length} stocks`);

    // Send the stock data as JSON response
    res.json(stocks);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching stock data from Firebase");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
