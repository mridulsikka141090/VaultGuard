import { initializeApp } from "firebase-admin/app";
import { searchStock } from "./SearchStock";

const app = initializeApp();

export const searchStockFunction = searchStock(app);