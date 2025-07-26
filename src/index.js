import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from 'path';
import https from "https";

// routes
import productRoute from './routes/product.route.js';
import uploadRoute from './routes/upload.route.js';
import brandRoute from "./routes/brand.route.js";
import categoryRoute from "./routes/category.route.js";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import paymentRoute from "./routes/payment.route.js";
import cmsRoute from "./routes/cms.route.js";
import geoLocationRoute from "./routes/geolocation.route.js";

// utilities
import connectDB from "./config/dbconnection.js";
import limiter from "./config/ratelimit.js";
import logger from './middlewares/logger.middleware.js';
import cors from "cors";
// import runConsumer from "./kafka/consumer.kafka.js";

const server = express();
server.use(express.json());
server.use(logger);

config();

server.use(cors());
server.use(cookieParser());

// DB Connection
connectDB();

// runConsumer();

server.use("/api/products", productRoute);
server.use("/api/upload", uploadRoute);
server.use("/api/brand", brandRoute);
server.use("/api/category", categoryRoute);
server.use("/api/user", userRoute);
server.use("/api/auth", authRoute);
server.use("/api/wishlist", wishlistRoute);
server.use("/api/cart", cartRoute);
server.use("/api/payment", paymentRoute);

server.use("/api/cms", cmsRoute);
server.use("/api/location", geoLocationRoute);

const options = {
  key: fs.readFileSync(path.resolve('src/cert/server.key')),
  cert: fs.readFileSync(path.resolve('src/cert/server.cert'))
};


https.createServer(options, server).listen(process.env.PORT || 8000, '0.0.0.0', () => {
  console.log(`✅ HTTPS Server running on port ${process.env.PORT || 8000}`);
});
