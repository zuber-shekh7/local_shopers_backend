import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import User from "../models/UserModel.js";
import Business from "../models/BusinessModel.js";
import Order from "../models/OrderModel.js";

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const orders = await Order.find({ user })
    .populate({ path: "orderItems", populate: { path: "product" } })
    .sort({ createdAt: -1 });

  return res.json({
    orders,
  });
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const { businessId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({
      message: "Invalid business id",
    });
  }

  const business = await Business.findById(businessId);

  if (!business) {
    return res.status(400).json({
      message: "Invalid business id",
    });
  }

  const orders = await Order.find({ business }).populate(
    "orderItems",
    "business"
  );

  return res.json({
    orders,
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const {
    userId,
    businessId,
    orderItems,
    shippingAddress,
    paymentMethod,
    tax,
    shippingCharges,
    totalPrice,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({
      message: "Invalid business id",
    });
  }

  const user = await User.findById(userId);
  const business = await Business.findById(businessId);

  if (!user) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  if (!business) {
    return res.status(400).json({
      message: "Invalid business id",
    });
  }

  const order = await Order.create({
    user,
    business,
    orderItems,
    shippingAddress,
    paymentMethod,
    tax,
    shippingCharges,
    totalPrice,
  });

  return res.json({
    order,
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const { order_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

  const order = await Order.findById(order_id).populate("orderItems");

  if (order) {
    return res.json({
      order,
    });
  }

  return res.status(400).json({
    message: "Invalid order id",
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

  const order = await Order.findById(orderId).populate("orderItems");

  if (order) {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { status }
    );

    return res.json({
      order: updatedOrder,
    });
  }

  return res.status(400).json({
    message: "Invalid order id",
  });
});

export {
  getUserOrders,
  getSellerOrders,
  createOrder,
  getOrder,
  updateOrderStatus,
};
