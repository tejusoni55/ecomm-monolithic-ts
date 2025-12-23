import { db } from "../../common/db";
import { products } from "../../common/db/schema";
import { GetAllProductsQuery } from "./products.validators";
import { count } from "drizzle-orm";

const ITEMS_PER_PAGE = 10;

export default {
  getAllProducts: async function (query: GetAllProductsQuery) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit ?? `${ITEMS_PER_PAGE}`);
    const offset = (page - 1) * limit;

    const [allProducts, totalCountResult] = await Promise.all([
      db.select().from(products).limit(limit).offset(offset),
      db.select({ count: count() }).from(products),
    ]);

    const total = totalCountResult[0]?.count || 0;

    const data = {
      products: allProducts,
      pagination: {
        page,
        perPage: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return {
      success: true,
      data,
    };
  },
};
