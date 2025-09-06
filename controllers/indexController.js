const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

const links = [
  { href: "/", text: "Home" },
  { href: "new", text: "New" },
  { href: "signup", text: "Sign Up" },
  { href: "login", text: "Log In" },
  { href: "logout", text: "Log Out" }
];


async function messagesGet(req, res) {
    const messages = await db.getAllMessages();
    res.render("index", { links: links, messages: messages });
}

async function newMessageGet(req, res) {
    res.render("form", { links: links });
}

async function newMessagePost(req, res) {
    const  authorName  = req.body.authorName;
    const  newMessage  = req.body.newMessage;
    const  addedDate  = new Date();
    await db.enterNewMessage(authorName, newMessage, addedDate);
    res.redirect("/");
}

async function signupGet(req, res) {
    res.render("sign-up-form", { links: links });
}

async function signupPost(req, res, next) {
try {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const initialStatus = "basic";
  await pool.query("INSERT INTO users (username, fname, lname, password, status) VALUES ($1, $2, $3, $4, $5)", [
      req.body.username,
      req.body.fname,
      req.body.lname,
      hashedPassword,
      initialStatus
    ]);
  res.redirect("/");
 } catch (error) {
    console.error(error);
    next(error);
   }
}

async function loginGet(req, res) {
    res.render("login-form", { links: links, user: req.user });
}

async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
module.exports = {
  messagesGet, newMessageGet, newMessagePost, signupGet, signupPost, loginGet, logout
};