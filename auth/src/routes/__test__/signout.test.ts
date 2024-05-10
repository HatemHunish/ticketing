import request from "supertest";
import { app } from "../../app";

it("clears the cookie upon signout", async () => {
  let user = {
    email: global.generateRandomEamil(),
    password: "password",
  };
  await request(app).post("/api/users/signup").send(user).expect(201);
  const res = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
  expect(res.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
