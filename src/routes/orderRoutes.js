import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/:user_id", [authenticate], getUserOrders);

router.post("", [authenticate], createOrder);

export default router;
