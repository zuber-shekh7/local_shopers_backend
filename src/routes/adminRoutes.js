import express from "express";
import { body } from "express-validator";
import {
  adminLogin,
  getAdminList,
  getCategoryAdmin,
  getProducts,
  getSellerList,
  getUsersList,
  getBusinessCategory,
} from "../controllers/adminControllers.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").not().isEmpty().isEmail().normalizeEmail(),
    body("password").not().isEmpty().isString(),
  ],
  adminLogin
);
router.post(
  "/getproducts",
  [body("categoryId").isEmpty().isString()],
  getProducts
);

router.post("/getcategories", [], getCategoryAdmin);

router.post("/getseller", [], getSellerList);

router.post("/getusers", [], getUsersList);

router.post("/getadmins", [], getAdminList);

router.post("/getbusinesscategory", [], getBusinessCategory);

export default router;
