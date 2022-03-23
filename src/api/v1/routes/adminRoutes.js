import express from "express";
import { body } from "express-validator";
import {
  adminLogin,
  getAdminList,
  getCategoryAdmin,
  getProducts,
  getBusinessCategory,
  getStatistics,
  getCustomers,
  getSellers,
} from "../controllers/adminControllers.js";
import {
  allowAdminOnly,
  authenticate,
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
  adminLogin
);

router.post(
  "/getproducts",
  [body("categoryId").isEmpty().isString()],
  getProducts
);

router.post("/get", [], getStatistics);

router.post("/getcategories", [], getCategoryAdmin);

router.get("/sellers", [authenticate, allowAdminOnly], getSellers);

router.get("/customers", [authenticate, allowAdminOnly], getCustomers);

router.post("/getadmins", [], getAdminList);

router.post("/getbusinesscategory", [], getBusinessCategory);

export default router;
