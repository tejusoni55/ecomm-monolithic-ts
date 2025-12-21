import express from "express";
import usersRoute from "../../modules/users/users.route";
import productsRoute from "../../modules/products/products.route";
import ordersRoute from "../../modules/orders/orders.route";
import adminRoute from "../../modules/admin/admin.route";

const router = express.Router();

// API v1 routes
const apiV1Router = express.Router();
apiV1Router.use("/users", usersRoute);
apiV1Router.use("/products", productsRoute);
apiV1Router.use("/orders", ordersRoute);
router.use("/api/v1", apiV1Router);

// Admin routes
router.use("/api/admin", adminRoute);

export default router;