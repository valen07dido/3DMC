const { Router } = require("express");
const {
  getUserhandler,
} = require("../../handlers/userHandlers/getUsersHandlers");
const { isAuthenticated } = require("../../middlewares/Authentication");

const useRouter = Router();

useRouter.get("/",isAuthenticated, getUserhandler);
useRouter.get("/:id",isAuthenticated, getUserhandler);

module.exports = useRouter;
