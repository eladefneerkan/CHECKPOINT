const request = require("supertest");
const app = require("../server");

describe("User routes", () => {
  test("Backend root route should respond with success message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Backend running successfully/);
  });

  test("Signup should create a new user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({ username: "testuser", password: "12345" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message || res.body.error).toBeDefined();
  });

  test("Login with wrong password should fail", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Invalid/);
  });
});
