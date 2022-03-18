import express from "express";
import {
  getSeller,
  googleAuthentication,
  sellerLogin,
  sellerSignup,
  updateSeller,
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
    body("email")
      .notEmpty()
      .withMessage("email cannot be an empty field.")
      .isEmail()
      .withMessage("email is invalid, enter valid email."),
    body("password")
      .notEmpty()
      .withMessage("password cannot be an empty field.")
      .isString()
      .withMessage("password must be valid string."),
  ],
  sellerLogin
);

router.post(
  "/signup",
  [
    body("email")
      .notEmpty()
      .withMessage("email cannot be an empty field.")
      .isEmail()
      .withMessage("email is invalid, enter valid email."),
    body("password")
      .notEmpty()
      .withMessage("password cannot be an empty field.")
      .isString()
      .withMessage("password must be valid string."),
  ],
  sellerSignup
);

router.post(
  "/login/google",
  [body("token").exists().notEmpty().isString()],
  googleAuthentication
);

router.get("/:sellerId", [authenticateSeller, allowSellerOnly], getSeller);

router.put("/:seller_id", [authenticateSeller, allowSellerOnly], updateSeller);

export default router;
