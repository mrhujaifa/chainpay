import express, { type Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { IndexRoutes } from "./routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("ok");
});

// All routes
app.use("/api/v1", IndexRoutes);

app.post("/api/v1/webhooks/circle", (req, res) => {
  console.log("EVENT:", req.body);

  res.status(200).send("ok");
});

app.get("/", (req, res) => {
  res.json({ message: "ChainPay API Running" });
});
export default app;
