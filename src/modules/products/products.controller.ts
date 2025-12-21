import { Request, Response } from "express";
import productsService from "./products.service";

export default {
  getAllProducts: async function (req: Request, res: Response) {
    const result = await productsService.getAllProducts(req.query);
    res.json(result);
  },
};
