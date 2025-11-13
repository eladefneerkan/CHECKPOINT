const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User"); 

// POST signup
router.post("/signup", async (req, res) => {
  console.log("SIGNUP BODY:", req.body);
  try {
    const { username, password, email, bio, profilePicture } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      bio,
      profilePicture,
    });

    await newUser.save();

    res.json({ message: "User signed up successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login
router.post("/login", async (req, res) => {
  console.log("SIGNUP BODY:", req.body);

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful!",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
