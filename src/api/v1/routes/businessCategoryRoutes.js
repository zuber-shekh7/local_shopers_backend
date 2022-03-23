import express from "express";
import multer from "multer";

import {
  createBusinessCategory,
  deleteBusinessCategory,
  editBusinessCategory,
  getBusinessCategories,
  getBusinessCategory,
} from "../controllers/businessCategoryControllers.js";
import { body } from "express-validator";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

const upload = multer();

router.get("/", [authenticate], getBusinessCategories);

router.post(
  "/",
  [
    authenticate,
    upload.single("image"),
    body("name").exists().notEmpty().isString(),
    body("description").exists().notEmpty().isString(),
  ],
  createBusinessCategory
);

router.get("/:category_id", [authenticate], getBusinessCategory);

router.put(
  "/:category_id",
  [authenticate, upload.single("image")],
  editBusinessCategory
);

router.delete("/:category_id", [authenticate], deleteBusinessCategory);

export default router;
