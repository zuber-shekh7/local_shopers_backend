import express from "express";
import { sellerLogin, sellerSignup } from "../controllers/sellerControllers.js";
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

router.post(
  "/signup",
  [
    body("firstName").notEmpty().isString(),
    body("lastName").notEmpty().isString(),
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("password").notEmpty().isString(),
  ],
  sellerSignup
);

export default router;
