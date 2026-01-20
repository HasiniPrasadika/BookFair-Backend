import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { CLIENT_ORIGIN } from "./config/env";
import prisma from "./config/db";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error";

const app = express();
const port = Number(process.env.PORT) || 8080;

/* ------------------ Middleware ------------------ */
app.use(helmet());

app.use(
  cors({
    origin: CLIENT_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ------------------ Routes ------------------ */
app.use("/api", routes);

/* ------------------ Health Check (IMPORTANT) ------------------ */
app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

/* ------------------ Errors ------------------ */
app.use(notFound);
app.use(errorHandler);

/* ------------------ Start server IMMEDIATELY ------------------ */
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

/* ------------------ Connect DB AFTER server starts ------------------ */
(async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // ❗ DO NOT exit — Cloud Run will retry
  }
})();
