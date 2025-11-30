process.env.JWT_SECRET = "testsecret";
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.disconnect();
  await mongoose.connect(uri, {
    dbName: "testdb",
  });
});


afterEach(async () => {
  if (mongoose.connection.readyState !== 1) return;

  const cols = await mongoose.connection.db.collections();

  for (let col of cols) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
