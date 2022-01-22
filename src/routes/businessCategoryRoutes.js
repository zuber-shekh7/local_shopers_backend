import express from "express";

import {
  createBusinessCategory,
  getBusinessCategories,
} from "../controllers/businessCategoryControllers.js";
import { body } from "express-validator";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", [authenticate], getBusinessCategories);

router.post(
  "/new",
  [
    authenticate,
    body("name").exists().notEmpty().isString(),
    body("description").exists().notEmpty().isString(),
  ],
  createBusinessCategory
);

export default router;
