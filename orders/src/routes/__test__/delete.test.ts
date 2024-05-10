import { OrderStatus } from "@microservice-training/common";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
const createTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  return await ticket.save();
};
it("check if order is cancled ", async () => {
  const user1 = global.signin();
  const ticket1 = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  const { body: newOrder } = await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", user1);

  expect(newOrder.status).toEqual(OrderStatus.Cancelled);
});
it("emits a cancel event if order is cancled ", async () => {
  const user1 = global.signin();
  const ticket1 = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);
  const { body: newOrder } = await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", user1);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
