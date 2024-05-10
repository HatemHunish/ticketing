import request from "supertest";
import { app } from "../../app";

it("response with current user details", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  const cookie = await global.signin();
  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(300);
  const currentUser = res.body?.currentUser;
  expect(currentUser).toBeDefined();
  expect(currentUser["email"]).toEqual(user.email);
});
it("response with null if not authenticated", async () => {
  let user = {
    email: global.generateRandomEamil(true),
    password: "password",
  };
  const res = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  const currentUser = res.body?.currentUser;
  expect(currentUser).toBeNull();
});
