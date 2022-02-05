import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getOrder,
  getSellerOrders,
  getUserOrders,
} from "../controllers/orderControllers.js";
import {
  authenticate,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", [authenticate], getUserOrders);
router.get("/seller/", [authenticateSeller], getSellerOrders);
router.get("/:order_id", [authenticate], getOrder);

router.post(
  "",
  [
    authenticate,
    body("user_id").exists().notEmpty().isString(),
    body("business_id").exists().notEmpty().isString(),
    body("orderItems").exists().notEmpty().isArray(),
    body("shippingAddress").exists().notEmpty().isObject(),
    body("paymentMethod").exists().notEmpty().isString(),
    body("tax").exists().notEmpty().isNumeric(),
    body("shippingCharges").exists().notEmpty().isNumeric(),
    body("totalPrice").exists().notEmpty().isNumeric(),
  ],
  createOrder
);

export default router;
