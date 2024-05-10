import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the ticket is not found", async () => {
  await request(app)
    .get("/api/tickets/65b1a604d07afdbb2b181a62")
    .send()
    .expect(404);
});
it("returns the ticket if the ticket is found", async () => {
  const title = "Black Pink";
  const price = 300;
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
