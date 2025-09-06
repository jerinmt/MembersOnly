const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.messagesGet);
indexRouter.get("/signup", indexController.signupGet);
indexRouter.post("/signup", indexController.signupPost);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/logout", indexController.logout);
indexRouter.get("/new", indexController.newMessageGet);//ONLY AUTHENTICATED USERS CAN POST NEW MESSAGE
indexRouter.post("/new", indexController.newMessagePost);

module.exports = indexRouter;
