const { Router } = require("express");
const indexController = require("../controllers/indexController");
const accountController = require("../controllers/accountController");

const indexRouter = Router();

indexRouter.get("/", indexController.messagesGet);
indexRouter.get("/signup", accountController.signupGet);
indexRouter.post("/signup", accountController.signupPost);
indexRouter.get("/login", accountController.loginGet);
indexRouter.get("/logout", accountController.logout);
indexRouter.get("/new", indexController.newMessageGet);
indexRouter.post("/new", indexController.newMessagePost);
indexRouter.post("/upgrade", accountController.upgradePost);
indexRouter.get("/wrongCode", accountController.wrongCodeGet);
indexRouter.post("/delete", indexController.deletePost);

module.exports = indexRouter;
