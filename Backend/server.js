const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const usersRoute = require("./routes/users");
const cors = require("cors");
const db = require("./db");


const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", usersRoute);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});


//listen IF not a test process!!!
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
}

module.exports = app;
