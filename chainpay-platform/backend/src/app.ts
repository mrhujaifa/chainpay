import express, { type Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { IndexRoutes } from "./routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// All routes
app.use("/api/v1", IndexRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ChainPay API Running" });
});
export default app;
