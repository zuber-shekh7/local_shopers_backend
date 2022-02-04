import express from "express";
import {
  createOrder,
  getOrder,
  getUserOrders,
} from "../controllers/orderControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", [authenticate], getUserOrders);
router.get("/:order_id", [authenticate], getOrder);

router.post("", [authenticate], createOrder);

export default router;
