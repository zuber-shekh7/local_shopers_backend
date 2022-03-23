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

router.get("/:businessCategoryId", [authenticate], getBusinessCategory);

router.put(
  "/:businessCategoryId",
  [authenticate, upload.single("image")],
  editBusinessCategory
);

router.delete("/:businessCategoryId", [authenticate], deleteBusinessCategory);

export default router;
