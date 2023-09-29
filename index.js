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
app.get("/", function (request, response) {
  response.render("home.handlebars");
});

// defines route "/projects"
app.get("/projects", function (request, response) {
  response.render("projects.handlebars");
});

// defines route "/about"
app.get("/about", function (request, response) {
  response.render("about.handlebars");
});

// defines route "/contact"
app.get("/contact", function (request, response) {
  response.render("contact.handlebars");
});

app.get("/user-dashboard", function (request, response) {
  response.render("user-dashboard.handlebars");
});

app.get("/project-dashboard", function (request, response) {
  response.render("project-dashboard.handlebars");
});

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
