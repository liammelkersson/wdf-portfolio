// ========== LOADING PACKAGES ==========
const express = require("express");
const { engine } = require("express-handlebars");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectSqlite3 = require("connect-sqlite3");
const cookieParser = require("cookie-parser");
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

// ========== POST FORMS ==========
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ========== SESSIONS ==========
//stores sessions in the db
const SQLiteStore = connectSqlite3(session);

//defines the session
app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    "saveUninitialized": false,
    "resave": false,
    "secret": "what-111s-real-w111ll-prosper",
  })
);

// ========== LOADING ASSETS ==========
// define static directory "public" to access css/, img/ and vid/
app.use(express.static("public"));

// ========== LOG ALL URL REQUESTS ==========
// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
  console.log("Req. URL: ", req.url);
  next();
});

// ========== DEFINING ROUTES ==========
// defines route "/"
app.get("/", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    idLoggedIn: req.session.isLoggoedIn,
  };

  res.render("home.handlebars", model);
  console.log("SESSION: ", session);
});

// renders route "/projects" with DATA from db
app.get("/projects", function (req, res) {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
        isAdmin: req.session.isAdmin,
        idLoggedIn: req.session.isLoggoedIn,
      };

      res.render("projects.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
        isAdmin: req.session.isAdmin,
        idLoggedIn: req.session.isLoggoedIn,
      };

      res.render("projects.handlebars", model);
    }
  });
});

// defines route "/about"
app.get("/about", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    idLoggedIn: req.session.isLoggoedIn,
  };

  res.render("about.handlebars", model);
});

// defines route "/contact"
app.get("/contact", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    idLoggedIn: req.session.isLoggoedIn,
  };

  res.render("contact.handlebars", model);
});

// ========== DEFINING "ADMIN" ROUTES ==========
app.get("/login", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    idLoggedIn: req.session.isLoggoedIn,
  };

  res.render("login.handlebars", model);
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (
    (username == "liammelkersson" && password == "abc123") ||
    (username == "jerome" && password == "youngjerome123")
  ) {
    req.session.isAdmin = true;
    req.session.isLoggoedIn = true;

    console.log("Admin logged in");
    res.redirect("/project-dashboard");
  } else {
    req.session.isAdmin = false;
    req.session.isLoggoedIn = false;

    console.log("Wrong password!");
    //alert user here
    res.redirect("/login");
  }

  // Requires a sqlite3 database
  // db.get("SELECT * FROM users WHERE uUserName = ?", [username], (err, user) => {
  //   if (err) {
  //     res.status(500).send({ error: "Server error" });
  //   } else if (!user) {
  //     res.status(401).send({ error: "User not found" });
  //   } else {
  //     const result = bcrypt.compareSync(password, user.uPassword);
  //     if (result) {
  //       req.session.uUserName = user;
  //       res.redirect("/project-dashboard");
  //     } else {
  //       res.status(401).send({ error: "Wrong password" });
  //     }
  //   }
  // });
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
          isAdmin: req.session.isAdmin,
          idLoggedIn: req.session.isLoggoedIn,
        };

        res.render("user-dashboard.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          users: theUsers,
          isAdmin: req.session.isAdmin,
          idLoggedIn: req.session.isLoggoedIn,
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
          isAdmin: req.session.isAdmin,
          idLoggedIn: req.session.isLoggoedIn,
        };
        console.log("Error: " + theError);
        res.render("project-dashboard.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          projects: theProjects,
          isAdmin: req.session.isAdmin,
          idLoggedIn: req.session.isLoggoedIn,
        };

        res.render("project-dashboard.handlebars", model);
      }
    });
  } else {
    res.redirect("/login");
  }
});

// // Route to destroy the session (should be defined after session middleware)
// app.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.send("Session destroyed");
// });

// ========== DEFINING FINAL ROUTE 404: NOT FOUND ==========
app.use(function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    idLoggedIn: req.session.isLoggoedIn,
  };

  res.status(404).render("404.handlebars", model);
});

// ========== RUNS APP & LISTENS ON PORT:  ==========
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
