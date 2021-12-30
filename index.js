import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";

import db from "./src/config/db.js";

import coreRoutes from "./src/routes/coreRoutes.js";
import { errorHandler } from "./src/middlewares/errorMiddlewares.js";

// initialization
const app = express();
dotenv.config();

// database connection
db();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// constants
const HOST = process.env.HOST;
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV;

// routes
app.use("/api", coreRoutes);

// error handler middleware
app.use(errorHandler);

// listen
app.listen(PORT, () => {
  console.log(
    `Server is running in ${NODE_ENV} mode on ${HOST}:${PORT}`.blue.bold
  );
});
