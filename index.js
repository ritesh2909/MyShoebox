const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");



const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger.json");
// routes
const productRoute = require("./routes/product");
const brandRoute = require("./routes/brand");
const categoryRoute = require("./routes/category");
const userRouter = require("./routes/user");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const wishListRoute = require("./routes/wishlist");
const paymentRoute = require("./routes/payment");
const cmsRoute = require("./routes/cms");


// utilities
const { connectDB } = require("./config/dbconnection");
const {limiter} =  require("./config/ratelimit")

const logger = require('./middlewares/logger');

const cors = require("cors");
const server = express();
server.use(bodyParser.json());
server.use(logger);

dotenv.config();

server.use(express.json());
server.use(cors());
server.use(cookieParser());




// DB Connection
connectDB();

// Serve Swagger UI at /api-docs
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

server.use("/api/products", productRoute.router);
server.use("/api/brand", brandRoute.router);
server.use("/api/category", categoryRoute.router);
server.use("/api/user", userRouter.router);
server.use("/api/auth", authRoute.router);
server.use("/api/wishlist", wishListRoute.router);
server.use("/api/cart", cartRoute.router);
server.use("/api/payment", paymentRoute.router);
server.use("/api/cms", cmsRoute.router);
// server.use("/api/coupon", couponRoute.router)


server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
