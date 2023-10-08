// ========== LOADING PACKAGES ==========
const express = require("express");
const { engine } = require("express-handlebars");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectSqlite3 = require("connect-sqlite3");

// ========== OTHER VARIABLES ==========
const port = 3000;
const app = express();

// Model (DATA) from the database.js module
const db = require("./db/database");

// stores sessions in a db
const SQLiteStore = connectSqlite3(session);

// function that converts the role into a number
function roleConverter(role) {
  if (role == "Admin") {
    return "1";
  } else if (role == "User") {
    return "2";
  } else if (role == "User Manager") {
    return "3";
  } else if (role == "Editor") {
    return "4";
  } else if (role == "Creator") {
    return "5";
  } else {
    console.log("There was an error with role conversion");
  }
}

// ========== MVC SETUP ==========
// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// ========== MIDDLEWARES ==========
// Post forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//defines the session
app.use(
  session({
    store: new SQLiteStore({ db: "/db/session-db.db" }),
    "saveUninitialized": false,
    "resave": false,
    "secret": "what-111s-real-w111ll-prosper",
  })
);

// define static directory "public"
app.use(express.static("public"));

// Logs all URL requests
app.use((req, res, next) => {
  console.log("Req. URL: ", req.url);
  next();
});

// ========== DEFINING ROUTES ==========
app.get("/", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role,
  };

  res.render("home.handlebars", model);
  console.log("SESSION: ", session);
});

app.get("/projects", function (req, res) {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      };

      res.render("projects.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      };

      res.render("projects.handlebars", model);
    }
  });
});

app.get("/specific-project/:id", (req, res) => {
  const id = req.params.id;

  db.get(
    "SELECT * FROM projects WHERE pID=?",
    [id],
    function (error, theProjects) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          projects: {},
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };

        res.render("specific-project.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          projects: theProjects,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };

        res.render("specific-project.handlebars", model);
      }
    }
  );
});

app.get("/about", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role,
  };

  res.render("about.handlebars", model);
});

app.get("/contact", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role,
  };

  res.render("contact.handlebars", model);
});

// ========== DEFINING "ADMIN/USER" ROUTES ==========
app.get("/login", function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role,
  };

  res.render("login.handlebars", model);
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  // const role = parseInt(req.body.role, 10);

  // if (
  //   (username == "liammelkersson" && password == "abc123") ||
  //   (username == "jerome" && password == "youngjerome123")
  // ) {
  //   req.session.isAdmin = true;
  //   req.session.isLoggedIn = true;

  //   console.log("Admin logged in");
  //   res.redirect("/project-dashboard");
  // } else {
  //   req.session.isAdmin = false;
  //   req.session.isLoggedIn = false;

  //   console.log("Wrong password!");
  //   //alert user here
  //   res.redirect("/login");
  // }

  db.get("SELECT * FROM users WHERE uUserName = ?", [username], (err, user) => {
    if (err) {
      res.status(500).send({ error: "Server error" });
    } else if (!user) {
      res.status(401).send({ error: "User not found" });
    } else {
      const result = bcrypt.compareSync(password, user.uPassword);
      if (result) {
        req.session.role = user.uRole;
        req.session.username = user;
        req.session.isLoggedIn = true;

        db.get(
          "SELECT * FROM users WHERE uUserName = ?",
          [username],
          (err, user) => {
            if (err) {
              res.status(500).send({ error: "Server error" });
            } else if (!user) {
              res.status(401).send({ error: "User not found" });
            } else {
              const result = bcrypt.compareSync(password, user.uPassword);
              if (result) {
                req.session.role = user.uRole;
                req.session.isLoggedIn = true;

                if (user.uRole === 1) {
                  req.session.isAdmin = true;
                } else {
                  req.session.isAdmin = false;
                }

                res.redirect("/project-dashboard");
              } else {
                res.status(401).send({ error: "Wrong password" });
              }
            }
          }
        );
      }
    }
  });
});

app.get("/logout", function (req, res) {
  const model = {
    isAdmin: false,
    isLoggedIn: false,
  };

  req.session.destroy();
  res.render("home.handlebars", model);
});

app.get("/user-dashboard", function (req, res) {
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.all("SELECT * FROM users", function (error, theUsers) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          users: [],
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };

        res.render("user-dashboard.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          users: theUsers,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };

        res.render("user-dashboard.handlebars", model);
      }
    });
  } else {
    console.log("You are not Logged In");
    //alert user here
    res.redirect("/login");
  }
});

app.get("/project-dashboard", function (req, res) {
  if (req.session.isLoggedIn == true) {
    db.all("SELECT * FROM projects", function (error, theProjects) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          projects: [],
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };
        console.log("Error: " + theError);
        res.render("project-dashboard.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          projects: theProjects,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };

        res.render("project-dashboard.handlebars", model);
      }
    });
  } else {
    console.log("You are not Logged In");
    //alert user here
    res.redirect("/login");
  }
});

// ========== DELETING USERS & PROJECTS ==========
app.get("/user/delete/:id", (req, res) => {
  const id = req.params.id;

  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("DELETE FROM users WHERE uID=?", [id], function (error, theUsers) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };
        res.render("home.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };
        res.render("home.handlebars", model);
        res.redirect("/user-dashboard");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/projects/delete/:id", (req, res) => {
  const id = req.params.id;

  if (req.session.isLoggedIn == true) {
    db.run(
      "DELETE FROM projects WHERE pID=?",
      [id],
      function (error, theProjects) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            isAdmin: req.session.isAdmin,
            isLoggedIn: req.session.isLoggedIn,
            role: req.session.role,
          };
          res.render("home.handlebars", model);
        } else {
          const model = {
            dbError: false,
            theError: "",
            isAdmin: req.session.isAdmin,
            isLoggedIn: req.session.isLoggedIn,
            role: req.session.role,
          };
          res.render("home.handlebars", model);
          res.redirect("/project-dashboard");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

// ========== CREATING USERS & PROJECTS ==========
app.get("/user/new", (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin) {
    const model = {
      isAdmin: req.session.isAdmin,
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    };

    res.render("newuser.handlebars", model);
  } else {
    res.redirect("/login");
  }
});

app.post("/user/new", (req, res) => {
  const saltRounds = 10;

  bcrypt.hash(req.body.uPassword, saltRounds, (err, hash) => {
    if (err) {
      // Handle error
      console.error("Error hashing password:", err);
    } else {
      // Store the hashed password in the database
      const hashedPassword = hash;

      // Now, you can insert the hashed password into the database
      const newu = [
        req.body.uName,
        req.body.uUserName,
        req.body.uEmail,
        hashedPassword,
        req.body.uRole,
      ];

      if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
        db.run(
          "INSERT INTO users (uName, uUserName, uEmail, uPassword, uRole) VALUES (?, ?, ?, ?, ?)",
          newu,
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the user tabe!");
            }
            res.redirect("/user-dashboard");
          }
        );
      } else {
        res.redirect("/login");
      }
    }
  });
});

app.get("/project/new", (req, res) => {
  if (req.session.isLoggedIn) {
    const model = {
      isAdmin: req.session.isAdmin,
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    };

    res.render("newproject.handlebars", model);
  } else {
    res.redirect("/login");
  }
});

app.post("/project/new", (req, res) => {
  const newp = [
    req.body.pTitle,
    req.body.pIntro,
    req.body.pDesc,
    req.body.pImageURL,
    req.body.pGitHubURL,
    req.body.pTech,
    req.body.pCat,
    req.body.pUser,
  ];

  if (req.session.isLoggedIn) {
    db.run(
      "INSERT INTO projects (pTitle, pIntro, pDesc, pImageURL, pGitHubURL, pTech, pCat, pUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      newp,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the projects tabe!");
        }
        res.redirect("/project-dashboard");
      }
    );
  } else {
    res.redirect("/login");
  }
});

// ========== MODIFYING USERS & PROJECTS ==========
app.get("/user/update/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM users WHERE uID=?", [id], function (error, theUser) {
    if (error) {
      console.log("ERROR: ", error);

      const model = {
        dbError: true,
        theError: error,
        user: {},
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      };
      res.render("modifyuser.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        user: theUser,
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
        helpers: {
          theRoleA(value) {
            return value == "Admin";
          },
          theRoleU(value) {
            return value == "User";
          },
          theRoleUM(value) {
            return value == "User Manager";
          },
          theRoleE(value) {
            return value == "Editor";
          },
          theRoleC(value) {
            return value == "Creator";
          },
        },
      };
      res.render("modifyuser.handlebars", model);
    }
  });
});

app.post("/user/update/:id", (req, res) => {
  const saltRounds = 10;
  const id = req.params.id;

  bcrypt.hash(req.body.uPassword, saltRounds, (err, hash) => {
    if (err) {
      // Handle error
      console.error("Error hashing password:", err);
    } else {
      const hashedPassword = hash;

      const newu = [
        req.body.uName,
        req.body.uUserName,
        req.body.uEmail,
        hashedPassword,
        roleConverter(req.body.uRole),
        id,
      ];

      if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
        db.run(
          "UPDATE users SET uName=?, uUserName=?, uEmail=?, uPassword=?, uRole=? WHERE uID=?",
          newu,
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("User updated!");
            }
            res.redirect("/user-dashboard");
          }
        );
      } else {
        res.redirect("/login");
      }
    }
  });
});

app.get("/projects/update/:id", (req, res) => {
  const id = req.params.id;

  db.get(
    "SELECT * FROM projects WHERE pID=?",
    [id],
    function (error, theProject) {
      if (error) {
        console.log("ERROR: ", error);

        const model = {
          dbError: true,
          theError: error,
          project: {},
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
        };
        res.render("modifyproject.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          project: theProject,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
          role: req.session.role,
          helpers: {
            theCatFE(value) {
              return value == "Front-end";
            },
            theCatFS(value) {
              return value == "Full-stack";
            },
            theCatGD(value) {
              return value == "Game dev";
            },
            theCatP(value) {
              return value == "Practice";
            },
            theCatAD(value) {
              return value == "App dev";
            },
          },
        };
        res.render("modifyproject.handlebars", model);
      }
    }
  );
});

app.post("/projects/update/:id", (req, res) => {
  const id = req.params.id;
  const newp = [
    req.body.pTitle,
    req.body.pIntro,
    req.body.pDesc,
    req.body.pImageURL,
    req.body.pGitHubURL,
    req.body.pTech,
    req.body.pCat,
    req.body.pUser,
    id,
  ];

  if (req.session.isLoggedIn == true) {
    db.run(
      "UPDATE projects SET pTitle=?, pIntro=?, pDesc=?, pImageURL=?, pGitHubURL=?, pTech=?, pCat=?, pUser=? WHERE pID=?",
      newp,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Project updated!");
        }
        res.redirect("/project-dashboard");
      }
    );
  } else {
    res.redirect("/login");
  }
});

// ========== DEFINING FINAL ROUTE 404: NOT FOUND ==========
app.use(function (req, res) {
  const model = {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role,
  };

  res.status(404).render("404.handlebars", model);
});

// ========== RUNS APP & LISTENS ON PORT:  ==========
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
