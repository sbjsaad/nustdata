import express from "express";
import cors from "cors";
import env from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { protect } from "./middleware/auth.js";

import authRoutes from "./modules/auth/auth.routes.js";
import studentRoutes from "./modules/student/student.routes.js";
import billingRoutes from "./modules/billing/billing.routes.js";
import invoiceRoutes from "./modules/invoice/invoice.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import chargeRoutes from "./modules/charge/charge.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "System Auto API is running" });
});

app.use("/api/auth", authRoutes);

app.use("/api", protect);

app.use("/api/students", studentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/charges", chargeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
