const request = require("supertest");
const app = require("../server");
const User = require("../models/User");

describe("User Routes (In-Memory MongoDB)", () => {
  
  test("GET / should respond with backend status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Backend running successfully/i);
  });

  test("POST /users/signup should create a new user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({
        username: "testuser",
        password: "12345",
        email: "user@test.com",
        bio: "Hello world"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User signed up successfully!");
  });

  test("POST /users/signup should fail missing fields", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({
        username: "",
        password: ""
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test("POST /users/signup assigns a default profile picture", async () => {
    await request(app)
      .post("/users/signup")
      .send({ username: "pfpTest", password: "12345" });

    const user = await User.findOne({ username: "pfpTest" });
    expect(user.profilePicture).toMatch(/default_profile_/);
  });

  test("POST /users/signup should fail for duplicate username", async () => {
    await request(app)
      .post("/users/signup")
      .send({ username: "dupe", password: "12345" });

    const res = await request(app)
      .post("/users/signup")
      .send({ username: "dupe", password: "54321" });

    expect(res.statusCode).toBe(500);
  });

  test("POST /users/login returns JWT when valid", async () => {
    await request(app)
      .post("/users/signup")
      .send({ username: "loginUser", password: "mypassword" });

    const res = await request(app)
      .post("/users/login")
      .send({ username: "loginUser", password: "mypassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /users/login wrong password should fail", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ username: "loginUser", password: "wrong" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  test("POST /users/login non-existing user fails", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ username: "ghostuser", password: "123" });

    expect(res.statusCode).toBe(401);
  });

  test("GET /users/me fails without token", async () => {
    const res = await request(app).get("/users/me");
    expect(res.statusCode).toBe(401);
  });

  test("GET /users/me works with valid token", async () => {
    //create test user
    await request(app)
      .post("/users/signup")
      .send({ username: "meUser", password: "abc123" });

    const login = await request(app)
      .post("/users/login")
      .send({ username: "meUser", password: "abc123" });

    const token = login.body.token;

    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("meUser");
  });

  test("GET /users/me invalid token fails", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer BADTOKEN");

    expect(res.statusCode).toBe(401);
  });

  test("PUT /users/me updates profile", async () => {
    await request(app)
      .post("/users/signup")
      .send({ username: "updateUser", password: "pass" });

    const login = await request(app)
      .post("/users/login")
      .send({ username: "updateUser", password: "pass" });

    const token = login.body.token;

    const res = await request(app)
      .put("/users/me")
      .set("Authorization", "Bearer " + token)
      .send({
        email: "updated@mail.com",
        bio: "Updated bio"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updated@mail.com");
    expect(res.body.bio).toBe("Updated bio");
  });

  test("PUT /users/me fails without token", async () => {
    const res = await request(app)
      .put("/users/me")
      .send({ bio: "should fail" });

    expect(res.statusCode).toBe(401);
  });


  test("GET /users returns array", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
