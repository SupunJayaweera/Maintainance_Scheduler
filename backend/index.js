import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config({ quiet: true });

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// db connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// routes
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to the Maintenance Scheduler App",
  });
});

app.use("/api-v1", routes);

// error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

// not found middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
