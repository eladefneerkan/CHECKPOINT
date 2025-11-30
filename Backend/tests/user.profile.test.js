const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const mongoose = require("mongoose");

describe("PROFILE ROUTES", () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      username: "john",
      password: "hashedpass",
      email: "john@mail.com",
      bio: "hello"
    });

    userId = user._id.toString();

    token = "mocked.jwt.token";
  });

  test("GET /users/me returns logged in user", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("mockuser");
  });

  test("PATCH /users/me edits bio", async () => {
    const res = await request(app)
      .patch("/users/me")
      .set("Authorization", "Bearer " + token)
      .send({ bio: "new bio updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("new bio updated");
  });

  test("PATCH /users/me edits email & username", async () => {
    const res = await request(app)
      .patch("/users/me")
      .set("Authorization", "Bearer " + token)
      .send({
        email: "updated@mail.com",
        username: "newname"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updated@mail.com");
    expect(res.body.username).toBe("newname");
  });

  test("Profile picture upload (mocked file)", async () => {
    const res = await request(app)
      .post("/users/upload-profile-picture")
      .set("Authorization", "Bearer " + token)
      .attach("profilePicture", Buffer.from("fake image"), "test.png");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/uploaded/i);
  });
});
