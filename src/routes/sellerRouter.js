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
  googleAuthentication
);

router.get("/:seller_id", [authenticateSeller, allowSellerOnly], getSeller);
router.put("/:seller_id", [authenticateSeller, allowSellerOnly], updateSeller);

export default router;
