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

router.post("/get", [], getStatistics);

router.post("/getcategories", [], getCategoryAdmin);

router.get("/sellers", [authenticate, allowAdminOnly], getSellers);

router.get("/customers", [authenticate, allowAdminOnly], getCustomers);

router.post("/getadmins", [], getAdminList);

router.post("/getbusinesscategory", [], getBusinessCategory);

export default router;
