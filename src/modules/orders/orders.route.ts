import express from "express";
import ordersController from "./orders.controller";
import auth from "../../common/middlewares/auth";
import { validate } from "../../common/middlewares/validate";
import { createOrderSchema } from "./orders.validators";

const router = express.Router();

router.get("/", auth.authenticate, ordersController.getAllOrders);
router.post("/", auth.authenticate, validate(createOrderSchema), ordersController.createOrder);

export default router;

