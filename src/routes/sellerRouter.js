import express from "express";
import { sellerLogin } from "../controllers/sellerControllers.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").notEmpty().isString().isEmail(),
    body("password").notEmpty().isString(),
  ],
  sellerLogin
);

export default router;
