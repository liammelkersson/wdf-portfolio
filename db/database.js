// ========== PACKAGES  ==========
const express = require("express");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

// ========== CREATE NEW DB  ==========
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database created");
  }
});

// ========== PROJECTS TABLE ==========
db.run(
  `
  CREATE TABLE projects (
    pID INTEGER PRIMARY KEY AUTOINCREMENT,
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
          "intro":
            "Full-stack portfolio with CRUD operations for the Web development fundamentals course.",
          "desc":
            "Meet the Full Stack Portfolio Manager with CRUD Operations—an awesome web app designed to give individuals, creatives, and professionals the power to show off their work, skills, and accomplishments in an interactive online portfolio. This project brings together both front-end and back-end tech to create a versatile platform that makes managing and displaying your portfolio a breeze.",
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
          "intro":
            "Front-end e-commerce website for a Coffee brand called Umble Beans.",
          "desc":
            "Umble Beans presents a captivating front-end e-commerce website that invites coffee enthusiasts into a world of premium coffee experiences. Discover our meticulously curated selection of aromatic blends, single-origin beans, and artisanal accessories. With a sleek and user-friendly interface, our website makes it effortless to explore, shop, and savor the rich flavors of Umble Beans' coffee offerings. ",
          "imageURL": "img/umble-beans.png",
          "gitHubURL": "https://github.com/ju-nmd2022/wuid-project-group-16",
          "tech": "HTML, CSS, JavaScript, Graphic Design, UX",
          "cat": "2",
          "user": "1",
        },
        {
          "id": "4",
          "title": "Lunar Lander",
          "intro":
            "This was an exercise to learn JavaScript, done for a course called Foundations of Programming",
          "desc":
            "Blast off into an exhilarating lunar adventure with our Lunar Lander Game. Strap in as you take control of a lunar module, navigating the treacherous terrain of martian surface. This captivating game was meticulously crafted to provide both thrills and challenges, offering players a chance to test their piloting skills in the harsh lunar environment.",
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
          "intro":
            "AI-chat bot, made with an API. Inspired by the giant chat bot ChatGPT of course.",
          "desc":
            "Step into the future of conversational AI with our cutting-edge chatbot, powered by a robust API and inspired by the legendary ChatGPT. Our AI chatbot brings the magic of natural language understanding to your fingertips. Engage in seamless and insightful conversations, ask questions, seek advice, or simply chat for fun. With its AI-driven intelligence, our chatbot offers a human-like interaction that's both informative and entertaining. Just like its inspiration, ChatGPT, it's a testament to the incredible capabilities of AI and is designed to enhance your online experiences with a touch of sophistication and innovation.",
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

// ========== USERS TABLE ==========
db.run(
  "CREATE TABLE users (uID INTEGER PRIMARY KEY AUTOINCREMENT, uName TEXT, uUserName TEXT NOT NULL, uPassword TEXT NOT NULL, uEmail TEXT NOT NULL, uRole INTEGER, FOREIGN KEY (uRole) REFERENCES roles (rID))",
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
          "name": "Ivo Petrovic",
          "username": "ivopivo1337",
          "password": "guccigang69",
          "email": "ivo.pivo@bing.com",
          "role": "2",
        },
      ];

      //inserts users
      users.forEach((oneUser) => {
        const saltRounds = 10; // Number of salt rounds for hashing

        bcrypt.hash(oneUser.password, saltRounds, (err, hash) => {
          if (err) {
            // Handle error
            console.error("Error hashing password:", err);
          } else {
            // Store the hashed password in the database
            const hashedPassword = hash;
            // Now, you can insert the hashed password into the database
            db.run(
              "INSERT INTO users (uID, uName, uUserName, uPassword, uEmail, uRole) VALUES (?, ?, ?, ?, ?, ?)",
              [
                oneUser.id,
                oneUser.name,
                oneUser.username,
                hashedPassword, // Use the hashed password here
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
          }
        });
      });

      // logs if the table was created
      console.log("Table user created");
    }
  }
);

// ========== ROLES TABLE ==========
db.run(
  "CREATE TABLE roles (rID INTEGER PRIMARY KEY AUTOINCREMENT, rName TEXT NOT NULL, rPermissions TEXT NOT NULL, rDesc TEXT NOT NULL)",
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

// ========== CATEGORIES TABLE ==========
db.run(
  "CREATE TABLE categories (cID INTERGER PRIMARY KEY AUTOINCREMENT, cName TEXT NOT NULL, cDesc TEXT NOT NULL, cType TEXT NOT NULL)",
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
