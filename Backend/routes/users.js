const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); 
const auth = require("../middleware/authorize");


// POST signup
router.post("/signup", async (req, res) => {

  const defaultPictures = [
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/default_profile_blue.png?rand=" + Math.random(),
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/default_profile_green.png?rand=" + Math.random(),
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/default_profile_red.png?rand=" + Math.random(),
  ];
  
  const randomDefault = defaultPictures[Math.floor(Math.random() * defaultPictures.length)];
  
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
      profilePicture: randomDefault,
    });

    await newUser.save();

    res.json({ message: "User signed up successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    //JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    res.json({
      message: "Login successful!",
      token,
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



// GET logged-in user's info
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


// UPDATE profile (email, bio, pp)
router.put("/me", auth, async (req, res) => {
  try {
    const updates = {};

    if (req.body.email) updates.email = req.body.email;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







module.exports = router;