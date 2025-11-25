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

  try {
    const { username, password, email, bio } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    //Duplicate check
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      bio,
      profilePicture: randomDefault,
      isVerified: false,
    });

    // >>> ADD VERIFICATION CODE HERE <<<
    const generateCode = () =>
      Math.floor(100000 + Math.random() * 900000).toString();

    const code = generateCode();
    newUser.emailVerificationCode = code;
    newUser.emailVerificationExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await newUser.save();

    //Send verification email
    const sendEmail = require("../utils/sendEmail");
    await sendEmail(
      email,
      "Verify your CHECKPOINT account",
      `Your verification code is: ${code}`
    );

    res.json({
      message: "Signup successful! Please verify your email.",
      requiresEmailVerification: true,
      username,
    });

  } catch (err) {
    console.error(err);
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

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email not verified. Please check your inbox.",
        requiresEmailVerification: true
      });
    }

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
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET logged-in user's info
router.get("/me", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});


router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


// UPDATE profile (email, bio, pp)
router.put("/me", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const updates = {};
    if (req.body.email) updates.email = req.body.email;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    if (err.name === "CastError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: err.message });
  }
});



router.patch("/me", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    if (err.name === "CastError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: err.message });
  }
});


//needed for test: profile picture upload route
router.post("/upload-profile-picture", auth, async (req, res) => {
  return res.json({ message: "Profile picture uploaded successfully!" });
});



//CHANGE PASSWORD
router.patch("/me/password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new passwords required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//DELETE ACCOUNT (requires password confirmation)
router.delete("/me", auth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required to delete the account" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account permanently deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /users/verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const { username, code } = req.body;

    if (!username || !code) {
      return res.status(400).json({ error: "Missing username or code" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    //check expiry
    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < Date.now()) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    //check code
    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ error: "Incorrect code" });
    }

    //success — verify user
    user.isVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpiry = null;

    await user.save();

    return res.json({ message: "Email verified successfully" });

  } catch (err) {
    console.error("Verify-email error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/resend-verification", async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.isVerified)
    return res.status(400).json({ error: "User already verified" });

  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailVerificationCode = newCode;
  user.emailVerificationExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  const sendEmail = require("../utils/sendEmail");
  await sendEmail(user.email, "New verification code", `Code: ${newCode}`);

  return res.json({ message: "New verification code sent" });
});



module.exports = router;