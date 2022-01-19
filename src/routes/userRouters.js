import express from "express";
import { body } from "express-validator";

import {
  getUserProfile,
  updateUserProfile,
  userGoogleLogin,
  userLogin,
  userSignup,
} from "../controllers/userControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").not().isEmpty().isEmail().normalizeEmail(),
    body("password").not().isEmpty().isString(),
  ],
  userLogin
);

router.post(
  "/signup",
  [
    body("firstName").not().isEmpty().isString(),
    body("lastName").not().isEmpty().isString(),
    body("email").not().isEmpty().isEmail().normalizeEmail(),
    body("password").not().isEmpty().isString(),
  ],
  userSignup
);

router.get("/profile", [authenticate], getUserProfile);

router.put(
  "/profile",
  [
    authenticate,
    body("firstName").not().isEmpty().isString(),
    body("lastName").not().isEmpty().isString(),
    body("email").not().isEmpty().isEmail().normalizeEmail(),
    body("mobile").not().isEmpty().isString(),
  ],
  updateUserProfile
);

router.post(
  "/login/google",
  [body("token").exists().notEmpty().isString()],
  userGoogleLogin
);

export default router;
