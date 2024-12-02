const { Router } = require("express");
const { loginHandler } = require("../../handlers/userHandlers/loginHandler");
const {
  createUserHandler,
} = require("../../handlers/userHandlers/createUserHandler");
const { logoutHandler } = require("../../handlers/userHandlers/logoutHandler");
const { isAuthenticated } = require("../../middlewares/Authentication");
const {activateUserHandler}=require("../../handlers/userHandlers/activateUserHandler")
const useRouter = Router();

useRouter.post("/login", loginHandler);
useRouter.post("/register", createUserHandler);
useRouter.post("/logout", isAuthenticated, logoutHandler);
useRouter.post("/activate/:token", activateUserHandler);
module.exports = useRouter;
