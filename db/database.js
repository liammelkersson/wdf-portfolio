const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database created");
  }
});

//PROJECTS TABLE
db.run(
  `
  CREATE TABLE projects (
    pID INTEGER PRIMARY KEY,
    pTitle TEXT NOT NULL,
    pIntro TEXT NOT NULL,
    pDesc TEXT NOT NULL,
    pImageURL TEXT NOT NULL,
    pGitHubURL TEXT NOT NULL,
    pTech TEXT NOT NULL,
    pCat INTEGER NOT NULL,
    pUser INTEGER NOT NULL,
    FOREIGN KEY (pCat) REFERENCES categories (cID),
    FOREIGN KEY (pUser) REFERENCES users (uID)
);
  )`,
  (error) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      const projects = [
        {
          "id": "1",
          "title": "Frogger Game",
          "intro": `Goal of the project was to gain knowledge within object-oriented
          programming (OOP)`,
          "desc":
            "A modern take on the classic arcade game. In this game, the player must navigate a frog through various obstacles to reach its destination safely. You have 10 seconds to do this before you lose and the goal is to get as much points as you can before running out of time. As you progress, the game gets harder and harder.",
          "imageURL": "img/frogger.png",
          "gitHubURL":
            "https://github.com/ju-nmd2022/fop-final-project-project-30",
          "tech": "HTML, CSS, JavaScript, p5.js",
          "cat": "1",
          "user": "1",
        },
        {
          "id": "2",
          "title": "Portfolio Website",
          "intro": "intro",
          "desc": "Portoflio website...",
          "imageURL": "img/portfolio.png",
          "gitHubURL": "https://github.com/liammelkersson/wdf-portfolio",
          "tech":
            "HTML, CSS, JavaScript, Node.js, Express, Handlebars, Tailwind, Postman, SQLite3",
          "cat": "4",
          "user": "1",
        },
        {
          "id": "3",
          "title": "Umble Beans",
          "intro": "intro",
          "desc": "fron a coffee e-commerce website",
          "imageURL": "img/umble-beans.png",
          "gitHubURL": "https://github.com/ju-nmd2022/wuid-project-group-16",
          "tech": "HTML, CSS, JavaScript",
          "cat": "2",
          "user": "1",
        },
        {
          "id": "4",
          "title": "Lunar Lander",
          "intro": "intro",
          "desc": "fun game",
          "imageURL": "img/lunarlander.png",
          "gitHubURL":
            "https://github.com/ju-nmd2022/fop-lunar-lander-liammelkersson",
          "tech": "HTML, JavaScript, p5.js",
          "cat": "1",
          "user": "1",
        },
        {
          "id": "5",
          "title": "AI-chat bot",
          "intro": "intro",
          "desc": "api exercise",
          "imageURL": "img/chat-bot.png",
          "gitHubURL": "https://github.com/liammelkersson/ai-chat-bot",
          "tech": "HTML, CSS, JavaScript, API's",
          "cat": "5",
          "user": "1",
        },
      ];

      //inserts projects
      projects.forEach((oneProject) => {
        db.run(
          "INSERT INTO projects (pID, pTitle, pIntro, pDesc, pImageURL, pGitHubURL, pTech, pCat, pUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            oneProject.id,
            oneProject.title,
            oneProject.intro,
            oneProject.desc,
            oneProject.imageURL,
            oneProject.gitHubURL,
            oneProject.tech,
            oneProject.cat,
            oneProject.user,
          ],
          (error) => {
            if (error) {
              console.log("Error: ", error);
            } else {
              console.log("Line added into projects table!");
            }
          }
        );
      });
      // logs if the table was created
      console.log("Table projects created");
    }
  }
);

//USERS TABLE
db.run(
  "CREATE TABLE users (uID INTEGER PRIMARY KEY, uName TEXT, uUserName TEXT NOT NULL, uPassword TEXT NOT NULL, uEmail TEXT NOT NULL, uRole INTEGER, FOREIGN KEY (uRole) REFERENCES roles (rID))",
  (error) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      const users = [
        {
          "id": "1",
          "name": "Liam Melkersson",
          "username": "liammelkersson",
          "password": "abc123",
          "email": "liammelkersson@live.se",
          "role": "1",
        },
        {
          "id": "2",
          "name": "Jerome Landre",
          "username": "JL",
          "password": "youngjerome123",
          "email": "jerome.landre@ju.se",
          "role": "1",
        },
        {
          "id": "3",
          "name": "Jie Chen",
          "username": "chen00",
          "password": "caocao123",
          "email": "jie.chen@student.ju.se",
          "role": "2",
        },
        {
          "id": "4",
          "name": "Linus Isaksson",
          "username": "mungon",
          "password": "canweget100likes?",
          "email": "linus.isaksson@student.ju.se",
          "role": "2",
        },
        {
          "id": "5",
          "name": "John Doe",
          "username": "johndoe123",
          "password": "johndoe123",
          "email": "john.doe@icloud.com",
          "role": "2",
        },
      ];

      //inserts users
      users.forEach((oneUser) => {
        db.run(
          "INSERT INTO users (uID, uName, uUserName, uPassword, uEmail, uRole) VALUES (?, ?, ?, ?, ?, ?)",
          [
            oneUser.id,
            oneUser.name,
            oneUser.username,
            oneUser.password,
            oneUser.email,
            oneUser.role,
          ],
          (error) => {
            if (error) {
              console.log("Error: ", error);
            } else {
              console.log("Line added into users table!");
            }
          }
        );
      });
      // logs if the table was created
      console.log("Table user created");
    }
  }
);

//ROLES TABLE
db.run(
  "CREATE TABLE roles (rID INTEGER PRIMARY KEY, rName TEXT NOT NULL, rPermissions TEXT NOT NULL, rDesc TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      const roles = [
        {
          "id": "1",
          "name": "admin",
          "permissions": "all permissions",
          "desc":
            "has the owner roll of the website, and basically has access to everything",
        },
        {
          "id": "2",
          "name": "project manager",
          "permissions": "can edit,create,delete projects",
          "desc":
            "These people can, edit post and delete projects, but not users.",
        },
        {
          "id": "3",
          "name": "user manager",
          "permissions": "can edit,create,delete users",
          "desc":
            "can edit, add, delete users but doesnt have access to projects-management-system",
        },
        {
          "id": "4",
          "name": "editor",
          "permissions": "can only edit projects",
          "desc":
            "special role: this role exists if you want to give a user only the availabilty to edit projects",
        },
        {
          "id": "5",
          "name": "creator",
          "permissions": "can only create projects",
          "desc":
            "special role: this role exists if you want to give a user only the availabilty to create projects",
        },
      ];

      //inserts roles
      roles.forEach((oneRole) => {
        db.run(
          "INSERT INTO roles (rID, rName, rPermissions, rDesc) VALUES (?, ?, ?, ?)",
          [oneRole.id, oneRole.name, oneRole.permissions, oneRole.desc],
          (error) => {
            if (error) {
              console.log("Error: ", error);
            } else {
              console.log("Line added into roles table!");
            }
          }
        );
      });
      // logs if the table was created
      console.log("Table roles created");
    }
  }
);

//CATEGORIES TABLE (not done yet)
db.run(
  "CREATE TABLE categories (cID INTERGER PRIMARY KEY, cName TEXT NOT NULL, cDesc TEXT NOT NULL, cType TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      const categories = [
        {
          "id": "1",
          "name": "Front-End Development",
          "desc": "Usually something like a e-commerce or portfolio website",
          "type": "Websites",
        },
        {
          "id": "2",
          "name": "Full-Stack Development",
          "desc": "Server/db focused projects",
          "type": "Websites",
        },
        {
          "id": "3",
          "name": "Game Development",
          "desc": "Ususally coding game for practicing or for fun",
          "type": "Websites/Apps",
        },
        {
          "id": "4",
          "name": "Practice",
          "desc": "Random practice related projects",
          "type": "Coding related practice",
        },
        {
          "id": "5",
          "name": "App Development",
          "desc": "Usually desktop or mobile apps",
          "type": "Applications",
        },
      ];

      //inserts roles
      categories.forEach((oneCategory) => {
        db.run(
          "INSERT INTO categories (cID, cName, cDesc, cType) VALUES (?, ?, ?, ?)",
          [
            oneCategory.id,
            oneCategory.name,
            oneCategory.desc,
            oneCategory.type,
          ],
          (error) => {
            if (error) {
              console.log("Error: ", error);
            } else {
              console.log("Line added into categories table!");
            }
          }
        );
      });
      // logs if the table was created
      console.log("Table categories created");
    }
  }
);

module.exports = db;
