import { Request, Response } from "express";
import adminService from "./admin.service";

export default {
  getAllUsers: async function (req: Request, res: Response) {
    const result = await adminService.getAllUsers();
    res.json(result);
  },

  createProducts: async function (req: Request, res: Response) {
    const result = await adminService.createProducts(req.body);
    res.json(result);
  },
};

