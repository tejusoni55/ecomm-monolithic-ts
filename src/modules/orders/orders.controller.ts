import { Request, Response } from "express";
import ordersService from "./orders.service";

export default {
  getAllOrders: async function (req: Request, res: Response) {
    const payload = req.user;
    const result = await ordersService.getAllOrdersByUserId(payload.id);
    res.json(result);
  },

  createOrder: async function (req: Request, res: Response) {
    const payload = req.user;
    const result = await ordersService.createOrder(payload.id, req.body);
    res.json(result);
  },
};

