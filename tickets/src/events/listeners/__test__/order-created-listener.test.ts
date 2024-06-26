import { OrderCreatedEvent, OrderStatus } from "@microservice-training/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup=async()=>{
    const listener= new OrderCreatedListener(natsWrapper.client);

    const ticket=new Ticket({
        title:'contert',
        price:100,
        userId:'d3g3',
    });
    await ticket.save();

    const data:OrderCreatedEvent['data']={
       id:new mongoose.Types.ObjectId().toHexString(),
       status:OrderStatus.Create,
       version:0,
       expiredAt:'2020-01-01T00:00:00.000Z',
       userId:'d3g3',
       ticket:{
           id:ticket.id,
           price:ticket.price,
       }
    }
        // @ts-ignore
    const msg:Message={
        ack:jest.fn(),
    }

    return {listener,ticket,data,msg};
}

it('sets the orderId on the ticket',async()=>{
    const {listener,ticket,data,msg}=await setup();
    await listener.onMessage(data,msg);

    const updatedTicket=await Ticket.findById(ticket.id);


    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message',async()=>{
    const {listener,ticket,data,msg}=await setup();
    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event',async()=>{
    const {listener,ticket,data,msg}=await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdateData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]) 

    expect(ticketUpdateData.orderId).toEqual(data.id);
  
});