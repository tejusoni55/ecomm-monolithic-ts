import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./common/routes";
import { logger } from "./common/lib/logger";
import swaggerDoc from "./common/utils/swagger";
import { env } from "./config/env";
const port = env.PORT ?? 8000;

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Default routes
app.get("/", (req: Request, res: Response) => {
  res.send("Ok");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "healthy",
  });
});

// All of the routes
app.use(router);

// Swagger API documentation
swaggerDoc(app, parseInt(port));

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

export default app;
