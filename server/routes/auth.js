const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isDbConnected } = require("../db");
const store = require("../store/inMemoryStore");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    let existingUser;
    if (isDbConnected()) {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } else {
      existingUser = store.findUserByEmail(email.toLowerCase().trim());
    }

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let newUser;
    if (isDbConnected()) {
      newUser = await User.create({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
      });
    } else {
      newUser = store.createUser({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
      });
    }

    req.session.userId = String(newUser._id);

    return res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      user = store.findUserByEmail(email.toLowerCase().trim());
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    req.session.userId = String(user._id);

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("todo.sid");
    return res.json({ message: "Logged out" });
  });
});

router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user;
    if (isDbConnected()) {
      user = await User.findById(req.session.userId).select("_id username email");
    } else {
      user = store.findUserById(req.session.userId);
    }

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch user.", error: error.message });
  }
});

module.exports = router;
