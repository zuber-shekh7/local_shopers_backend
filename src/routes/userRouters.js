import express from "express";
import { body } from "express-validator";

import {
  getUserProfile,
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
export default router;
