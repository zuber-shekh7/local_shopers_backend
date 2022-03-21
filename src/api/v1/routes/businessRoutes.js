import express from "express";
import multer from "multer";
import { body } from "express-validator";
import {
  getBusiness,
  updateBusiness,
  createBusiness,
} from "../controllers/businessControllers.js";

import {
  allowSellerOnly,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();
const upload = multer();

router.post(
  "",
  [
    authenticateSeller,
    allowSellerOnly,
    upload.single("image"),
    body("name").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("businessCategoryId").exists().notEmpty().isString(),
  ],
  createBusiness
);

router.put(
  "/:businessId",
  [authenticateSeller, allowSellerOnly, upload.single("image")],
  updateBusiness
);

router.get("/:businessId", getBusiness);

export default router;
