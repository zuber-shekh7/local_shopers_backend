import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import db from "./src/api/v1/config/db.js";
import * as v1 from "./src/api/v1/routes/index.js";

import { errorHandler } from "./src/api/v1/middlewares/errorMiddlewares.js";
import { notFoundMiddleware } from "./src/api/v1/middlewares/notFoundMiddleware.js";

// initialization
const app = express();
dotenv.config();
const swaggerDocument = YAML.load("./src/api/v1/swagger/documentation.yaml");

// database connection
try {
  await db();
} catch (err) {
  console.err(err.red.bold);
  process.exit(1);
}

// middlewares
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN,
    preflightContinue: true,
    credentials: true,
  })
);
app.use(fileUpload());

// routes
app.use("/api/docs/v1", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/", v1.coreRoutes);
app.use("/api/v1/admin", v1.adminRoutes);
app.use("/api/v1/addresses", v1.addressRoutes);
app.use("/api/v1/business", v1.businessRoutes);
app.use("/api/v1/business-categories", v1.businessCategoryRoutes);
app.use("/api/v1/categories", v1.categoriesRoutes);
app.use("/api/v1/orders", v1.orderRoutes);
app.use("/api/v1/products", v1.productRoutes);
app.use("/api/v1/reviews", v1.reviewRoutes);
app.use("/api/v1/sellers", v1.sellerRoutes);
app.use("/api/v1/users", v1.userRoutes);
app.use("/api/v1/wishlists", v1.wishlistRoutes);

// not found middleware
app.use(notFoundMiddleware);

// error handler middleware
app.use(errorHandler);

export default app;
