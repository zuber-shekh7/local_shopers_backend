import express from "express";

import {
  createBusinessCategory,
  editBusinessCategory,
  getBusinessCategories,
  getBusinessCategory,
} from "../controllers/businessCategoryControllers.js";
import { body } from "express-validator";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", [authenticate], getBusinessCategories);

router.post(
  "/",
  [
    authenticate,
    body("name").exists().notEmpty().isString(),
    body("description").exists().notEmpty().isString(),
  ],
  createBusinessCategory
);

router.get("/:category_id", [authenticate], getBusinessCategory);

router.put("/:category_id", [authenticate], editBusinessCategory);
export default router;
