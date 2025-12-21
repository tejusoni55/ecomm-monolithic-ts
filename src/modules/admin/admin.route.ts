import express from "express";
import adminController from "./admin.controller";
import { validate } from "../../common/middlewares/validate";
import admin from "../../common/middlewares/admin";
import { createProductsSchema } from "./admin.validators";

const router = express.Router();

router.get("/users", admin.requireAdmin, adminController.getAllUsers);
router.post("/products", admin.requireAdmin, validate(createProductsSchema), adminController.createProducts);

export default router;
