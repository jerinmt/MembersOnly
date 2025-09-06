
const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages ORDER BY added DESC");
  return rows;
}

async function enterNewMessage(user, title, message, added) {
  await pool.query("INSERT INTO messages (username, title, message, added) VALUES ($1, $2, $3, $4)", [user, title, message, added]);
}


module.exports = {
  getAllMessages,
  enterNewMessage
};