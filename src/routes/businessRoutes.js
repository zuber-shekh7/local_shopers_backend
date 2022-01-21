import express from "express";
import { body } from "express-validator";
import {
  createBusinessCategory,
  getBusiness,
  getBusinessCategories,
  updateBusiness,
} from "../controllers/businessControllers.js";
import { getBusinessDetails } from "../controllers/sellerControllers.js";
import {
  allowSellerOnly,
  authenticate,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/:business_id", getBusiness);

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
