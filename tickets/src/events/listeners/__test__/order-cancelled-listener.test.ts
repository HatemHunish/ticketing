import { OrderCancelledEvent, OrderStatus } from "@microservice-training/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup=async()=>{
    const listener= new OrderCancelledListener(natsWrapper.client);

    const orderId=new mongoose.Types.ObjectId().toHexString();
    const ticket=new Ticket({
        title:'contert',
        price:100,
        userId:'d3g3',
    });
    ticket.set({orderId:orderId});
    await ticket.save();
    const data:OrderCancelledEvent['data']={
       id:orderId,
       version:0,
       ticket:{
           id:ticket.id,
       }
    }
        // @ts-ignore
    const msg:Message={
        ack:jest.fn(),
    }

    return {listener,ticket,data,msg,orderId};
}

it('updates the ticket, publishes an event and acks the message',async()=>{
    const {listener,ticket,data,msg,orderId}=await setup();
    await listener.onMessage(data,msg);
    const updateTicket=await Ticket.findById(ticket.id);
    expect(updateTicket?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})