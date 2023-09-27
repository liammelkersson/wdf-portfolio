//VARIABLES
const express = require("express");
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();

//Module for database
const db = require("./db/database");

// db.serialize(() => {
//   db.run(
//     "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
//   );
//   db.run("INSERT INTO users (name, age) VALUES (?, ?)", ["John", 25]);
//   db.run("INSERT INTO users (name, age) VALUES (?, ?)", ["Alice", 30]);
//   db.each("SELECT * FROM users", (err, row) => {
//     console.log(row);
//   });
// });

// db.close();

//  MVC SETUP
// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/, img/ and vid/
app.use(express.static("public"));

// CONTROLLER (THE BOSS)
// defines route "/"
app.get("/", function (request, response) {
  response.render("home.handlebars");
});

// defines route "/projects"
app.get("/projects", function (request, response) {
  // const model = { listHumans: humans }; // defines the model
  // // in the next line, you should send the abovedefined
  // // model to the page and not an empty object {}...
  response.render("projects.handlebars");
});

// defines route "/about"
app.get("/about", function (request, response) {
  // const model = humans[1]; // defines the model
  // // in the next line, you should send the abovedefined
  // // model to the page and not an empty object {}...
  response.render("about.handlebars");
});

// defines route "/contact"
app.get("/contact", function (request, response) {
  response.render("contact.handlebars");
});

app.get("/user-dashboard", function (request, response) {
  response.render("user-dashboard.handlebars");
});

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});
// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
