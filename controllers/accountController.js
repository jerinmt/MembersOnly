const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { body, validationResult } = require("express-validator");

const links = [
  { href: "/", text: "Home" },
  { href: "new", text: "New" },
  { href: "signup", text: "Sign Up" },
  { href: "login", text: "Account" },
  { href: "logout", text: "Log Out" }
];
const alphanumErr = "must only contain numbers and alphabets with no spaces and symbols.";
const alphaErr = "must only contain alphabets with no spaces and symbols.";
const lengthErr = "must be between 1 and 15 characters.";
const passwordErr = "must be between 5 and 15 characters.";

const validateUser = [
  body("username").trim()
    .isAlphanumeric().withMessage(`User name ${alphanumErr}`)
    .isLength({ min: 1, max: 15 }).withMessage(`User name ${lengthErr}`)
    .escape(),
  body("fname").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`)
    .escape(),
  body("lname").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`)
    .escape(),
  body("password").trim()
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${passwordErr}`)
    .escape(),
  body('repassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

async function signupGet(req, res) {
    res.render("sign-up-form", { links: links });
}

const signupPost = [
    validateUser,
    async (req, res, next) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).render("sign-up-form", {
            title: "Create New User",
            errors: errors.array(),
            links: links,
          });
        }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const initialStatus = "basic";
        await pool.query(
            "INSERT INTO users (username, fname, lname, password, status) VALUES ($1, $2, $3, $4, $5)", [
                req.body.username,
                req.body.fname,
                req.body.lname,
                hashedPassword,
                initialStatus
            ]
        );
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
}
];

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

async function upgradePost(req, res, next) {
  try {
  if(req.body.code === process.env.MEMBER_CODE) {
    await pool.query("UPDATE users SET status = $1 WHERE id = $2", ["member", req.user.id]);
    res.redirect("/");
  } else {
    res.redirect("/wrongCode");
  }
  
 } catch (error) {
    console.error(error);
    next(error);
   }
}

async function wrongCodeGet(req, res) {
  res.render("wrongcode", { links: links });
}

module.exports = {
  signupGet, signupPost, loginGet, logout, upgradePost, wrongCodeGet
};