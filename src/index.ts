import app from "./server";
import { env } from "./config/env";

const port = env.PORT ?? 8000;

app.listen(port, () => {
  console.log(`Running server on http://localhost:${port}`);
});
