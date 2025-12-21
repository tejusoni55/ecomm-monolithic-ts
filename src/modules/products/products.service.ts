import { db } from "../../common/db";
import { products } from "../../common/db/schema";
import { GetAllProductsQuery } from "./products.validators";
import { count } from "drizzle-orm";

const ITEMS_PER_PAGE = 10;

export default {
  getAllProducts: async function (query: GetAllProductsQuery) {
    const page = parseInt(query.page || "1", 10);
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const [allProducts, totalCountResult] = await Promise.all([
      db.select().from(products).limit(ITEMS_PER_PAGE).offset(offset),
      db.select({ count: count() }).from(products),
    ]);

    const total = totalCountResult[0]?.count || 0;

    return {
      success: true,
      data: {
        products: allProducts,
        pagination: {
          page,
          perPage: ITEMS_PER_PAGE,
          total,
          totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        },
      },
    };
  },
};

