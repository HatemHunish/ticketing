import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = (count: number) => {
  const promises = [];
  for (let idx = 0; idx < count; idx++) {
    const title = "Black Pink";
    const price = 300;
    let res = request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title,
        price,
      })
      .expect(201);
    promises.push(res);
  }
  return Promise.all(promises);
};
it("returns a list of tickets", async () => {
  const amount = 3;
  await createTicket(amount);
  const res = await request(app).get("/api/tickets").send().expect(200);
  expect(res.body.length).toEqual(amount);
});
