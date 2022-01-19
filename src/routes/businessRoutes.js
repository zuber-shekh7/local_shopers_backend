import express from "express";
import { body } from "express-validator";
import {
  createBusinessCategory,
  getBusinessCategories,
} from "../controllers/businessControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post(
  "/business-categories/new",
  [
    authenticate,
    body("name").exists().notEmpty().isString(),
    body("description").exists().notEmpty().isString(),
  ],
  createBusinessCategory
);

router.get("/business-categories", [authenticate], getBusinessCategories);

export default router;
