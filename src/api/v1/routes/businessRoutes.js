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
    body("name").notEmpty().withMessage("name cannot be empty").isString(),
    body("description")
      .notEmpty()
      .withMessage("description cannot be empty")
      .isString(),
    body("businessCategoryId")
      .notEmpty()
      .withMessage("businessCategoryId cannot be empty")
      .isString(),
  ],
  createBusiness
);

router.get("/:businessId", getBusiness);

router.put(
  "/:businessId",
  [authenticateSeller, allowSellerOnly, upload.single("image")],
  updateBusiness
);

export default router;
