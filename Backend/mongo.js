const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/DBNAME";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("mdb connected"))
.catch((err) => {
  console.error("mdb connection error:", err);
  process.exit(1);
});

module.exports = mongoose;
