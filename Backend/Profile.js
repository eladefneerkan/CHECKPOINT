const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) console.error("MySQL connection error:", err);
    else console.log("Connected!");
});

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/users", (req, res) => {
    db.query("Select * FROM users", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)

);