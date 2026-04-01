const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

// IMPORT ROUTE
app.use("/api/auth", require("../routes/auth"));

describe("Auth API", () => {

  // ✅ REGISTER TEST
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // ✅ LOGIN TEST
  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

});