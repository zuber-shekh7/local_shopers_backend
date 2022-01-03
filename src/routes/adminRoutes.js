import express from "express";
import { body } from "express-validator";
import { adminLogin } from "../controllers/adminControllers.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").not().isEmpty().isEmail().normalizeEmail(),
    body("password").not().isEmpty().isString(),
  ],
  adminLogin
);

export default router;
