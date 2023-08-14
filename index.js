const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoute = require("./routes/product");
const brandRoute = require("./routes/brand");
const categoryRoute = require("./routes/category");
const userRouter = require("./routes/user");
const authRoute = require("./routes/auth");

const cors = require("cors");
const server = express();
dotenv.config();

server.use(express.json());
server.use(cors());
mongoose.connect(process.env.MONGO_URL).then(console.log("DB connected"));

server.use("/appi/products", productRoute.router);
server.use("/api/brand", brandRoute.router);
server.use("/api/category", categoryRoute.router);
server.use("/api/user", userRouter.router);
server.use("/api/auth", authRoute.router);

server.listen(process.env.PORT, () => {
  console.log("Server started");
});
