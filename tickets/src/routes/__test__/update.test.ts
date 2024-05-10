import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const randomId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put("/api/tickets/" + randomId)
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 20,
    })
    .expect(404);
});
it("returns a 401 if the user is not authenticated", async () => {
  const randomId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put("/api/tickets/" + randomId)
    .send({
      title: "test",
      price: 20,
    })
    .expect(401);
});
it("returns a 401 if the user does not own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test ticket",
      price: 20,
    });
  const ticketId = res.body.id;
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signin())
    .send({
      title: "test ticket2",
      price: 20,
    })
    .expect(401);
});
it("returns a 400 if the user provides an invalid title or price", async () => {
  const user = global.signin();
  const res = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "test ticket",
    price: 20,
  });
  const ticketId = res.body.id;
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", user)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", user)
    .send({
      title: "test tick2",
      price: -1,
    })
    .expect(400);
});
it("updates the ticket provided valid inputs", async () => {
  const user = global.signin();
  const res = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "test ticket",
    price: 20,
  });
  const ticketId = res.body.id;
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", user)
    .send({
      title: "new title",
      price: 22,
    })
    .expect(200);
  const updatedTicket = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send();

  expect(updatedTicket.body.title).toEqual("new title");
  expect(updatedTicket.body.price).toEqual(22);
});

it("publishes an update event", async () => {
  const user = global.signin();
  const res = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "test ticket",
    price: 20,
  });
  const ticketId = res.body.id;
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", user)
    .send({
      title: "new title",
      price: 22,
    })
    .expect(200);
  const updatedTicket = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
it('rejects updates of a ticket that is already assigned to an order', async () => {
  const user = global.signin();
  const res = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "test ticket",
    price: 20,
  });
  const ticketId = res.body.id;
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", user)
    .send({
      title: "new title",
      price: 22,
    })
    .expect(200);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket= await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");
  ticket?.set({ orderId });
  await ticket.save();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", user)
    .send({
      title: "new title",
      price: 22,
    })
    .expect(400);
});