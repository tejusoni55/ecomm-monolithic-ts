import express from "express";
import userController from "./users.controller";
import { validate } from "../../common/middlewares/validate";
import auth from "../../common/middlewares/auth";
import { registerUserSchema, loginSchema } from "./users.validators";
const router = express.Router();

// Public routes
router.post("/", validate(registerUserSchema), userController.register);
router.post("/login", validate(loginSchema), userController.loginUser);
router.get("/profile", auth.authenticate, userController.getProfile);

export default router;
