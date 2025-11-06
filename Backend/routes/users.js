const express = require("express");
const router = express.Router();
const db = require("../db");

const bcrypt = require("bcrypt");

// POST add new user (signup)
router.post("/signup", async (req, res) => {
  const { userid, name, password } = req.body;
  if (!userid || !name || !password)
    return res.status(400).json({ error: "userid, name, and password required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hash password
    db.query(
      "INSERT INTO users (userid, name, password) VALUES (?, ?, ?)",
      [userid, name, hashedPassword],
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
  const { userid, password } = req.body;
  if (!userid || !password)
    return res.status(400).json({ error: "userid and password required" });

  // Get user from DB
  db.query(
    "SELECT * FROM users WHERE userid = ?",
    [userid],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid userid or password" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Invalid userid or password" });

      res.json({ message: "Login successful!", user: { userid: user.userid, name: user.name } });
    }
  );
});



// GET all users
router.get("/", (req, res) => {
    db.query("Select * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});

// POST add new user
router.post("/", (req, res) => {
    const { userid, name } = req.body;
    if (!userid || !name)
        return res.status(400).json({ error: "userid and name required" });

    db.query(
        "INSERT INTO users (userid, name) VALUES (?, ?)",
        [userid, name],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json({ message: "User added successfully!"});
        }
    );
});

// DELETE user by ID
router.delete("/:userid", (req, res) => {
  db.query(
    "DELETE FROM users WHERE userid = ?",
    [req.params.userid],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "User deleted successfully!" });
    }
  );
});

module.exports = router;
