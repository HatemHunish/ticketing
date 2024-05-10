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
it("fetche the order", async () => {
  const user1 = global.signin();
  const ticket1 = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", user1)
    .expect(200);
});
it("only fetch the order for current signin user", async () => {
  const user1 = global.signin();
  const user2 = global.signin();
  const ticket1 = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", user1)
    .expect(200);
  await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", user2)
    .expect(401);
});
