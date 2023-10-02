//loading pacakges
const express = require("express");
const { engine } = require("express-handlebars");

//variables
const port = 3000;
const app = express();

//Model (DATA) from the database.js module
const db = require("./db/database");

//  MVC SETUP
// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/, img/ and vid/
app.use(express.static("public"));

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
  console.log("Req. URL: ", req.url);
  next();
});

/***
ROUTES
***/
// defines route "/"
app.get("/", function (req, res) {
  res.render("home.handlebars");
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

app.get("/user-dashboard", function (req, res) {
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
});

app.get("/project-dashboard", function (req, res) {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        users: [],
      };

      res.render("project-dashboard.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        users: theProjects,
      };

      res.render("project-dashboard.handlebars", model);
    }
  });
});

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
