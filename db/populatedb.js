#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(20) NOT NULL,
  title VARCHAR(50) NOT NULL,
  message VARCHAR(255) NOT NULL,
  added TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(20) NOT NULL,
  fname VARCHAR(20) NOT NULL,
  lname VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(6) NOT NULL
);

INSERT INTO
  messages (username, title, message)
VALUES
  ('admin', 'Site rules', 'Login to enter your message, only selected members can see the authors of messages except for admin messages');
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