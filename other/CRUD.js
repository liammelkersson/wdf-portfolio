const express = require("express");
const { engine } = require("express-handlebars");

const port = 3000;
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));

// Define two arrays for User and Projects data
const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  // Add more user data here
];

const projects = [
  { id: 1, name: "Project 1" },
  { id: 2, name: "Project 2" },
  // Add more project data here
];

// Define CRUD operations for Users

// Read all users
app.get("/users", (req, res) => {
  res.render("users.hbs", { users });
});

// Read a single user by ID
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  res.render("user.hbs", { user });
});

// Create a new user (you can use a form for this)
app.post("/users", (req, res) => {
  // Parse request body and add the new user to the users array
  // Redirect to the users list or display a success message
});

// Update an existing user by ID (you can use a form for this)
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  // Find the user by ID and update their information
  // Redirect to the user's profile or display a success message
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  // Find the user by ID and remove them from the users array
  // Redirect to the users list or display a success message
});

// Define CRUD operations for Projects (similar to Users)

// ...

app.use((req, res) => {
  res.status(404).render("404.hbs");
});

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
