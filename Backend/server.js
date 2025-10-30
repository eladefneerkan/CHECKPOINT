const express = require("express");
const dotenv = require("dotenv");
const usersRoute = require("./routes/users");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/users", usersRoute);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);