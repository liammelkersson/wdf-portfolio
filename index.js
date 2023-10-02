// ========== LOADING PACKAGES ==========
const express = require("express");
const { engine } = require("express-handlebars");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
// const csrf = require("csurf");

// ========== OTHER VARIABLES ==========
const port = 3000;
const app = express();

// Model (DATA) from the database.js module
const db = require("./db/database");

// ========== MVC SETUP ==========
// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// ========== SECURITY FUNCTIONS ==========
// Authentication middleware (Define this first)
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// };

// Session middleware (Define this before any routes)
app.use(
  session({
    secret: "user",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

// Other middleware (e.g., static assets, CSRF, logging)

// ========== LOADING ASSETS ==========
// define static directory "public" to access css/, img/ and vid/
app.use(express.static("public"));

// defines a middleware to use CSRF
// app.use(csrf());

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
  console.log("Req. URL: ", req.url);
  next();
});

// ========== DEFINING ROUTES ==========
// defines route "/"
app.get("/", function (req, res) {
  res.render("home.handlebars", { user: req.session?.user });
});

// renders route "/projects" with DATA from db
app.get("/projects", function (req, res) {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
      };

      res.render("projects.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
      };

      res.render("projects.handlebars", model);
    }
  });
});

// defines route "/about"
app.get("/about", function (req, res) {
  res.render("about.handlebars");
});

// defines route "/contact"
app.get("/contact", function (req, res) {
  res.render("contact.handlebars");
});

// ========== DEFINING "ADMIN" ROUTES ==========
app.get("/login", function (req, res) {
  res.render("login.handlebars");
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;
  // Requires a sqlite3 database
  db.get("SELECT * FROM users WHERE uUserName = ?", [username], (err, user) => {
    if (err) {
      res.status(500).send({ error: "Server error" });
    } else if (!user) {
      res.status(401).send({ error: "User not found" });
    } else {
      const result = bcrypt.compareSync(password, user.uPassword);
      if (result) {
        req.session.uUserName = user;
        res.redirect("/project-dashboard");
      } else {
        res.status(401).send({ error: "Wrong password" });
      }
    }
  });
});

app.get("/user-dashboard", function (req, res) {
  if (req.session.uUserName) {
    res.render("/user-dashboard", { user: req.session.uUserName });
  } else {
    db.all("SELECT * FROM users", function (error, theUsers) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          users: [],
        };

        res.render("user-dashboard.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          users: theUsers,
        };

        res.render("user-dashboard.handlebars", model);
      }
    });
  }
});

app.get("/project-dashboard", function (req, res) {
  console.log(req.session.uUserName);
  if (req.session.uUserName) {
    db.all("SELECT * FROM projects", function (error, theProjects) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          projects: [],
        };
        console.log("Error: " + theError);
        res.render("project-dashboard.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          projects: theProjects,
        };

        res.render("project-dashboard.handlebars", model);
      }
    });
  } else {
    res.redirect("/login");
  }
});

// Route to destroy the session (should be defined after session middleware)
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Session destroyed");
});

// ========== DEFINING FINAL ROUTE 404: NOT FOUND ==========
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

// ========== RUNS APP & LISTENS ON PORT:  ==========
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
