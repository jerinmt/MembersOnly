#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(20) NOT NULL,
  message VARCHAR(255) NOT NULL,
  added TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO
  messages (username, message)
VALUES
  ('Jerin', 'Hi there!'),
  ('Jerin', 'Enter your message here');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,//environment variable
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();