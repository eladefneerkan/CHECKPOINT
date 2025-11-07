const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// POST signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO loginInfo (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: "User signed up successfully!" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  db.query(
    "SELECT * FROM loginInfo WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid username or password" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Invalid username or password" });

      res.json({ message: "Login successful!", user: { username: user.username } });
    }
  );
});

// Export router
module.exports = router;
