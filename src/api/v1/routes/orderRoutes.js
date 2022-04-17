import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getOrder,
  getSellerOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderControllers.js";
import {
  authenticate,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", [authenticate], getUserOrders);
router.get("/seller/", [authenticateSeller], getSellerOrders);
router.get("/:order_id", [authenticate], getOrder);
router.put(
  "/:orderId",
  [authenticateSeller, body("status").exists().notEmpty().isString()],
  updateOrderStatus
);

router.post(
  "",
  [
    authenticate,
    body("userId")
      .notEmpty()
      .withMessage("userId cannot be an empty field")
      .isString(),
    body("businessId")
      .notEmpty()
      .withMessage("businessID cannot be an empty field")
      .isString(),
    body("orderItems")
      .notEmpty()
      .withMessage("orderItems cannot be an empty array")
      .isArray(),
    body("shippingAddress")
      .notEmpty()
      .withMessage("shippingAddress cannot be an empty object")
      .isObject(),
    body("paymentMethod")
      .notEmpty()
      .withMessage("paymentMethod cannot be an empty field")
      .isString(),
    body("tax")
      .notEmpty()
      .withMessage("tex cannot be an empty field")
      .isNumeric(),
    body("shippingCharges")
      .notEmpty()
      .withMessage("shippingCharges cannot be an empty field")
      .isNumeric(),
    body("totalPrice")
      .notEmpty()
      .withMessage("totalPrice cannot be an empty field")
      .isNumeric(),
  ],
  createOrder
);

export default router;
