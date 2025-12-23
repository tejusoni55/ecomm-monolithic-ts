import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Request, Response } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecomm Rest APIs",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/common/routes/index.ts", "./src/modules/**/*.ts"],
};

const swaggerAPI = swaggerJsdoc(options);

export default function (app: Application, port: number) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerAPI));

  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    res.send(swaggerAPI);
  });

  console.log(`Swagger doc running on http://localhost:${port}/api-docs`);
}
