import express from "express";
import cors from "cors";
import { NextFunction } from "express";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize firebase
import { initializeApp } from "firebase-admin/app";
import { applicationDefault } from "firebase-admin/app";
initializeApp({
  credential: applicationDefault(),
});
console.log("Firebase initialized successfully");

import router from "./router.js";

app.use("/guessing-number-game/api", router);

// handel un-handled routes
app.use((req, res) => {
  res.status(404).json({ message: "API_ROUTE_NOT_FOUND" });
});

//handel error

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    if (err.type === "entity.parse.failed") {
      res.status(400).json({ message: "Invalid JSON payload passed." });
      return;
    }
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port: " + process.env.PORT || 3000 )
  console.log("Link to the server: http://localhost:" + process.env.PORT || 3000);
});
