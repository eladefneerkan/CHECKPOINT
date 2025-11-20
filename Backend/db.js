const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debug line
//console.log("PORT:", process.env.PORT); // Debug line
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"))
  .catch((err) => {
    console.error("connection error:", err.message);
    process.exit(1);
  });

module.exports = mongoose;
