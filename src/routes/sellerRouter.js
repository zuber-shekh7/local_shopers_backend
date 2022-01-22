import express from "express";
import {
  getSeller,
  sellerGoogleLogin,
  sellerLogin,
  sellerSignup,
} from "../controllers/sellerControllers.js";
import { body } from "express-validator";
import {
  allowSellerOnly,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

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

router.post(
  "/login/google",
  [body("token").exists().notEmpty().isString()],
  sellerGoogleLogin
);

router.get("/:seller_id", [authenticateSeller, allowSellerOnly], getSeller);

export default router;
