import { OrderStatus } from "@microservice-training/common";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
const createTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  return await ticket.save();
};
it("fetches orders for current user ", async () => {
  const user1 = global.signin();
  const user2 = global.signin();
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket3.id,
    })
    .expect(201);

  const user1Orders = await request(app)
    .get("/api/orders")
    .set("Cookie", user1);
  expect(user1Orders.body.length).toEqual(1);
  const user2Orders = await request(app)
    .get("/api/orders")
    .set("Cookie", user2);
  expect(user1Orders.body[0].ticket.id).toEqual(ticket1.id);
  expect(user2Orders.body.length).toEqual(2);

  expect(user2Orders.body[0].ticket.id).toEqual(ticket2.id);
  expect(user2Orders.body[1].ticket.id).toEqual(ticket3.id);
});
