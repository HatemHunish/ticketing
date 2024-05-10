import request from "supertest";
import { app } from "../../app";

it("returns a 400 on unregistred email", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  await request(app).post("/api/users/signup").send(user).expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: global.generateRandomEamil(true),
      password: "password",
    })
    .expect(400);
});
it("returns a 400 on incorrect password", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  await request(app).post("/api/users/signup").send(user).expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: user.email,
      password: "password1",
    })
    .expect(400);
});
it("returns a cookie on valid credentials", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  await request(app).post("/api/users/signup").send(user).expect(201);
  const res = await request(app)
    .post("/api/users/signin")
    .send(user)
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined();
});
