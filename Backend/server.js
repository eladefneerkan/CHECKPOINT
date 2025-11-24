const express = require("express");
const dotenv = require("dotenv");
const usersRoute = require("./routes/users");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use("/users", require("./routes/users"));
app.use("/search", require("./routes/search"));
app.use("/gameLists", require("./routes/gameLists"));

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
