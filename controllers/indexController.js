const db = require("../db/queries");
const pool = require("../db/pool");
const { body, validationResult } = require("express-validator");

const links = [
  { href: "/", text: "Home" },
  { href: "new", text: "New" },
  { href: "signup", text: "Sign Up" },
  { href: "login", text: "Account" },
  { href: "logout", text: "Log Out" }
];

const validateUser = [
  body("newTitle")
    .isLength({ min: 1, max: 50 }).withMessage(`Title must be between 1 and 50 characters.`)
    .escape(),
  body("newMessage")
    .isLength({ min: 1, max: 250 }).withMessage(`Message must be between 1 and 250 characters.`)
    .escape(),
];

async function messagesGet(req, res) {
    const messages = await db.getAllMessages();
    res.render("index", { links: links, messages: messages, user: req.user });
}

async function newMessageGet(req, res) {
  if(req.user) {
    res.render("form", { links: links, user: req.user });
  } else {
    res.redirect("/login");
  }
    
}

const newMessagePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("form", {
        title: "Create New Message",
        errors: errors.array(),
        links: links,
        user: req.user,
      });
    }
    const  authorName  = req.body.authorName;
    const  title  = req.body.newTitle;
    const  newMessage  = req.body.newMessage;
    const  addedDate  = new Date();
    await db.enterNewMessage(authorName, title, newMessage, addedDate);
    res.redirect("/");
}];

async function deletePost(req, res, next) {
  try {
    const messageId = req.body.messageid;
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
   }
}
module.exports = {
  messagesGet, newMessageGet, newMessagePost, deletePost
};