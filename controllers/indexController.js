const db = require("../db/queries");
const links = [
  { href: "/", text: "Home" },
  { href: "new", text: "New" },
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

module.exports = {
  messagesGet, newMessageGet, newMessagePost
};