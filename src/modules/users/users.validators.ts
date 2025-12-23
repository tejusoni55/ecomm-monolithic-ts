import { z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterUser:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          example: jane.doe@example.com
 *        name:
 *          type: string
 *          example: Jane Doe
 *        password:
 *          type: string
 *          example: Password@123
 *    RegisterUserResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        role:
 *          type: string
 *        isActive:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export const registerUserSchema = z.object({
  body: z.object({
    email: z.email().max(255),
    name: z.string().min(2).max(255),
    password: z.string().min(8).max(16),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          example: jane.doe@example.com
 *        password:
 *          type: string
 *          example: Password@123
 *    LoginUserResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        message:
 *          type: string
 *        token:
 *          type: string
 *        
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

const findUserByColumnSchema = z.object({
  id: z.number().optional(),
  email: z.email().optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginSchema>["body"];
export type findByColumnInput = z.infer<typeof findUserByColumnSchema>;
