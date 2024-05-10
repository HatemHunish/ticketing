import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  return request(app).post("/api/users/signup").send(user).expect(201);
});
it("returns a 400 with an invalid email", async () => {
  let user = {
    email: "",
    password: "password",
  };
  return request(app).post("/api/users/signup").send(user).expect(400);
});
it("returns a 400 with an invalid password", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "1",
  };
  return request(app).post("/api/users/signup").send(user).expect(400);
});
it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});
it("returns a 400 on a duplicated email", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  await request(app).post("/api/users/signup").send(user).expect(201);
  return request(app).post("/api/users/signup").send(user).expect(400);
});

it("sets a cookie after succeful signup", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  const res = await request(app)
    .post("/api/users/signup")
    .send(user)
    .expect(201);
  return expect(res.get("Set-Cookie")).toBeDefined();
});
