import express from "express";
import userController from "./users.controller";
import { validate } from "../../common/middlewares/validate";
import auth from "../../common/middlewares/auth";
import { registerUserSchema, loginSchema } from "./users.validators";
const router = express.Router();

// Public routes
/**
 * @openapi
 * '/api/v1/users/':
 *  post:
 *      tags: 
 *          - User
 *      summary: Register a New User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterUser'
 *      responses:
 *          200:
 *              description: Success
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RegisterUserResponse'
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 * 
 */
router.post("/", validate(registerUserSchema), userController.register);

/**
 * @openapi
 * '/api/v1/users/login':
 *  post:
 *      tags: 
 *          - User
 *      summary: Login
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginUserInput'
 *      responses:
 *          200:
 *              description: Return login details.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoginUserResponse'
 *          400:
 *              description: Bad Request.
 *          500:
 *              description: Internal Server Error.
 */
router.post("/login", validate(loginSchema), userController.loginUser);

/**
 * @openapi
 * '/api/v1/users/profile':
 *  get:
 *      tags:
 *          - User
 *      summary: Get profile details
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Fetch profile information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              name:
 *                                  type: string
 *                              id:
 *                                  type: string
 *                              
 *          400:
 *              description: Bad Request
 *          401:
 *              description: Unauthorized user
 *          500:
 *              description: Internal Server Error
 */
router.get("/profile", auth.authenticate, userController.getProfile);

export default router;
