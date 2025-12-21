import express from "express";
import productsController from "./products.controller";
import { validate } from "../../common/middlewares/validate";
import { getAllProductsSchema } from "./products.validators";

const router = express.Router();

router.get("/", validate(getAllProductsSchema), productsController.getAllProducts);

export default router;

