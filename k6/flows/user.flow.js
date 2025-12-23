import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export function userFlow(baseUrl) {
  // 1️⃣ Login
  const loginRes = http.post(
    `${baseUrl}/api/v1/users/login`,
    JSON.stringify({
      email: "tejusoniop@email.com",
      password: "12345678",
    }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(loginRes, {
    "login success": (r) => r.status === 200,
  });

  const token = loginRes.json("token");
  if (!token) return;

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  sleep(1);

  // 2️⃣ Browse products
  const limit = 5;
  const page = randomIntBetween(1, 5);
  const productsRes = http.get(`${baseUrl}/api/v1/products?page=${page}&limit=${limit}`);

  check(productsRes, {
    "products fetched": (r) => r.status === 200,
  });

  const products = productsRes.json();
  if (!products || products.length === 0) return;

  const productId = products[0].id;

  sleep(1);

  // 3️⃣ Place order
  const orderRes = http.post(
    `${baseUrl}/api/v1/orders`,
    JSON.stringify({
      productId,
      quantity: 1,
    }),
    {
      ...authHeaders,
      headers: {
        ...authHeaders.headers,
        "Content-Type": "application/json",
      },
    },
  );

  check(orderRes, {
    "order placed": (r) => r.status === 201,
  });

  sleep(1);
}
