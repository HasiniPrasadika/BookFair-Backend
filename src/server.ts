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

/* ------------------ Security & Middleware ------------------ */
app.use(helmet());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ------------------ Routes ------------------ */
app.use("/api", routes);

/* ------------------ Error Handling ------------------ */
app.use(notFound);
app.use(errorHandler);

/* ------------------ Server & DB ------------------ */
async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on port ${port}`);
});
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
