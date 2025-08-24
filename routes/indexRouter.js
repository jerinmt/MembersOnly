const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.messagesGet);
indexRouter.get("/signup", indexController.signupGet);//need to create signupGet function in controller
indexRouter.get("/signup", indexController.signupPost);//need to create signupPost function in controller
indexRouter.get("/new", indexController.newMessageGet);
indexRouter.post("/new", indexController.newMessagePost);

module.exports = indexRouter;
