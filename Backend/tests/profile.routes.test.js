/*

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");

// Mock JWT middleware so it always authenticates successfully
jest.mock("../middleware/authorize", () => {
  return (req, res, next) => {
    req.user = { id: req.headers["x-user-id"] }; 
    next();
  };
});

describe("PROFILE ROUTES (In-Memory Mongo)", () => {
  let mongo;
  let userId;
  let userPassword = "mypassword123";
  let hashedPassword;
  let token = "mock.jwt.token";

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    await User.deleteMany({});

    // Hash password manually to match bcrypt behavior
    const bcrypt = require("bcrypt");
    hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = await User.create({
      username: "john",
      password: hashedPassword,
      email: "john@mail.com",
      bio: "hello"
    });

    userId = user._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  // ---------------------------
  // Test GET /users/me
  // ---------------------------
  test("GET /users/me returns logged-in user", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("john");
    expect(res.body.bio).toBe("hello");
  });

  // ---------------------------
  // Test editing profile
  // ---------------------------
  test("PATCH /users/me edits bio", async () => {
    const res = await request(app)
      .patch("/users/me")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId)
      .send({ bio: "new bio updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("new bio updated");
  });

  test("PATCH /users/me edits email & username", async () => {
    const res = await request(app)
      .patch("/users/me")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId)
      .send({
        email: "updated@mail.com",
        username: "newname"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updated@mail.com");
    expect(res.body.username).toBe("newname");
  });

  // ---------------------------
  // Test DELETE with password
  // ---------------------------
  test("DELETE /users/me fails without password", async () => {
    const res = await request(app)
      .delete("/users/me")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  test("DELETE /users/me fails with wrong password", async () => {
    const res = await request(app)
      .delete("/users/me")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId)
      .send({ password: "wrongpw" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/incorrect/i);
  });

  test("DELETE /users/me succeeds with correct password", async () => {
    const res = await request(app)
      .delete("/users/me")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId)
      .send({ password: userPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    // Ensure user is actually deleted
    const exists = await User.findById(userId);
    expect(exists).toBeNull();
  });

  // ---------------------------
  // Test password change
  // ---------------------------
  test("PATCH /users/me/password changes password", async () => {
    const res = await request(app)
      .patch("/users/me/password")
      .set("Authorization", "Bearer " + token)
      .set("x-user-id", userId)
      .send({
        oldPassword: userPassword,
        newPassword: "newpass123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated/i);

    // Check DB
    const user = await User.findById(userId);
    const bcrypt = require("bcrypt");

    expect(await bcrypt.compare("newpass123", user.password)).toBe(true);
  });
});


*/