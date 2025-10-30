const express = require("express");
const router = express.Router();
const db = require("../db");


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
