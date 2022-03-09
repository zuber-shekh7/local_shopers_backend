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
    body("firstName").not().isEmpty().isString(),
    body("lastName").not().isEmpty().isString(),
    body("email").not().isEmpty().isEmail(),
    body("password").not().isEmpty().isString(),
  ],
  userSignup
);

router.get("/:user_id", [authenticate], getUser);

router.put(
  "/:user_id",
  [
    authenticate,
    body("firstName").not().isEmpty().isString(),
    body("lastName").not().isEmpty().isString(),
    body("email").not().isEmpty().isEmail(),
    body("mobile").not().isEmpty().isString(),
  ],
  updateUser
);

router.post(
  "/login/google",
  [body("token").exists().notEmpty().isString()],
  googleAuthentication
);

export default router;
