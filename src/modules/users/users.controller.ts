import { Request, Response } from "express";
import userService from "./users.service";

export default {
  register: async function (req: Request, res: Response) {
    const result = await userService.registerUser(req.body);
    res.json(result);
  },

  loginUser: async function (req: Request, res: Response) {
    const result = await userService.loginUser(req.body);
    res.json(result);
  },

  getProfile: async function (req: Request, res: Response) {
    let payload = req.user;
    let user = await userService.findUserByColumn({ id: payload.id });
    res.json(user);
  },
};
