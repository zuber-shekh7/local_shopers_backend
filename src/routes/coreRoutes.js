import express from "express";
import { sayHello } from "../controllers/coreControllers.js";

const router = express.Router();

router.get("/hello", sayHello);

export default router;
