import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { seedCategories } from "./modules/category/category.service.js";
import { logger, printStartup, printShutdown } from "./utils/logger.js";

async function startServer() {
  const startTime = Date.now();

  const dbName = await connectDB();
  await seedCategories();

  app.listen(env.port, () => {
    printStartup({
      port: env.port,
      dbName,
      bootMs: Date.now() - startTime,
    });
  });
}

startServer().catch((error) => {
  logger.error(`Startup failed — ${error.message}`);
  process.exit(1);
});

process.on("SIGINT", () => {
  printShutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  printShutdown();
  process.exit(0);
});
