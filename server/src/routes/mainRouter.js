const { Router } = require("express");
const userRouter = require("./userRoutes/userRouter");
const sesionRouter = require("./userRoutes/sesionRouter");
const productRouter = require("./productRoutes/productRouter");
const {PostMessage} = require("../handlers/emailHandler/emailHandler");
const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/sesion", sesionRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/send", PostMessage);
module.exports = mainRouter;
