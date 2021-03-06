import express from "express";
import { body } from "express-validator";

import {
  getUser,
  updateUser,
  googleAuthentication,
  userLogin,
  userSignup,
} from "../controllers/userControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

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
  userLogin
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
  userSignup
);

router.get("/:userId", [authenticate], getUser);

router.put("/:userId", [authenticate], updateUser);

router.post(
  "/login/google",
  [body("token").exists().notEmpty().isString()],
  googleAuthentication
);

export default router;
