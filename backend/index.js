const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(10);
const cookieParser = require("cookie-parser");
const jsonWebToken = require("jsonwebtoken");
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const User = require("./models/user");
require("dotenv").config();
const jsonWebTokenSecret = process.env.JWT_SECRET;
const app = express();
const port = 4040;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_STRING)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.log(err));

// Get todos for the logged-in user
app.get("/todo", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      jsonWebToken.verify(
        token,
        jsonWebTokenSecret,
        {},
        async (err, userData) => {
          if (err) throw err;
          const todos = await Todo.find({ userId: userData.userId });
          res.status(200).json(todos);
        }
      );
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
  }
});

// Add a new todo for the logged-in user
app.post("/new", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      jsonWebToken.verify(
        token,
        jsonWebTokenSecret,
        {},
        async (err, userData) => {
          if (err) throw err;
          const todo = await Todo.create({
            ...req.body,
            userId: userData.userId,
          });
          res.status(201).json(todo);
        }
      );
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
  }
});

// Delete a todo by id
app.delete("/delete/:id", async (req, res) => {
  try {
    const todos = await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
  }
});

// Update a todo by id
app.put("/update/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTodo);
  } catch (err) {
    console.error(err);
  }
});

// Get profile information of the logged-in user
app.get("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      jsonWebToken.verify(token, jsonWebTokenSecret, {}, (err, userData) => {
        if (err) throw err;
        res.status(200).json(userData);
      });
    }
  } catch (err) {
    console.error(err);
  }
});

// Login or register a user
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      const valid = bcrypt.compareSync(password, foundUser.password);
      if (valid) {
        jsonWebToken.sign(
          {
            userId: foundUser._id,
            username,
          },
          jsonWebTokenSecret,
          {},
          (err, token) => {
            if (err) {
              throw err;
            } else {
              res
                .cookie("token", token, { sameSite: "none", secure: true })
                .status(200)
                .json({ id: foundUser._id, valid: true });
            }
          }
        );
      } else {
        res.status(401).json({ valid: false });
      }
    } else {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const createdUser = await User.create({
        username: username,
        password: hashedPassword,
      });
      jsonWebToken.sign(
        { userId: createdUser._id, username },
        jsonWebTokenSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .status(200)
            .json({
              id: createdUser._id,
              username,
              valid: true,
            });
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
});

// Logout the user by clearing the token cookie
app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: true, secure: true }).status(200).json();
});

// Start the server
app.listen(port, () => console.log(`Server runs on ${port}`));
