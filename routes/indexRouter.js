const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.messagesGet);
indexRouter.get("/signup", indexController.signupGet);
indexRouter.post("/signup", indexController.signupPost);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/logout", indexController.logout);
indexRouter.get("/new", indexController.newMessageGet);
indexRouter.post("/new", indexController.newMessagePost);
indexRouter.post("/upgrade", indexController.upgradePost);
indexRouter.get("/wrongCode", indexController.wrongCodeGet);
indexRouter.post("/delete", indexController.deletePost);

module.exports = indexRouter;
