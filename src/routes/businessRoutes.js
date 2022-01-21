import express from "express";
import { body } from "express-validator";
import {
  createBusinessCategory,
  getBusinessCategories,
  updateBusiness,
} from "../controllers/businessControllers.js";
import {
  allowSellerOnly,
  authenticate,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

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

router.put(
  "/:business_id/edit",
  [authenticateSeller, allowSellerOnly],
  updateBusiness
);
router.get("/business-categories", [authenticate], getBusinessCategories);

export default router;
