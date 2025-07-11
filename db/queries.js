
const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function enterNewMessage(user, message, added) {
  await pool.query("INSERT INTO messages (username, message, added) VALUES ($1, $2, $3)", [user, message, added]);
}


module.exports = {
  getAllMessages,
  enterNewMessage
};