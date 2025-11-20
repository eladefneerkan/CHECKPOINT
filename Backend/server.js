const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./db");
const mongoose = require("mongoose");

const usersRoute = require("./routes/users");
const searchRoute = require("./routes/search");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", usersRoute);
app.use("/search", searchRoute);


app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// Listen (use default port 3000 when PORT isn't provided)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
