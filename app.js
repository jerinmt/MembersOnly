//imports
require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const path = require("node:path");
const pool = require("./db/pool");
const session = require("express-session");//require for session management
const passport = require("passport");//require for authentication
const LocalStrategy = require("passport-local").Strategy;//require for local strategy
//initialisations
const app = express();
const assetsPath = path.join(__dirname, "public");
//static fiiles
app.use(express.static(assetsPath));
const bcrypt = require("bcryptjs");

//views setting
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//for session management
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());

//for form values
app.use(express.urlencoded({extended: true}));

//checking if user is authenticated
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      // compare the hashed password with the provided password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
    
  })
);

// Serializing user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializing user from session
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

// Middleware to make the current user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


//routing
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/wrongCode",
  })
);
app.use("/", indexRouter);

// Error handling
app.get("/{*splat}", (req, res) => {
  res.send("Error 404: Page not found");
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Members Only app - listening on port ${PORT}!`);
});