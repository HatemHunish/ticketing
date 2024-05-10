import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@microservice-training/common";
import { Message } from "node-nats-streaming";

const setup=async ()=>{
    //create an instance of the listener
    const listener=new ExpirationCompleteListener(natsWrapper.client);
    
    const ticket=Ticket.build({
        title:'concert',
        price:10,
        id:new mongoose.Types.ObjectId().toHexString(),
    })

    await ticket.save();

    const order=Order.build(
        {
            userId:new mongoose.Types.ObjectId().toHexString(),
            expiresAt:new Date(),
            ticket:ticket,
            status:OrderStatus.Create,
        }
    );

    await order.save();

    const data:ExpirationCompleteEvent['data']={
        orderId:order.id,
    }
    // @ts-ignore
    const msg:Message={
        ack:jest.fn(),
    }
    return {listener,order,ticket,data,msg}
}

it('updates the order status to cancelled', async () => {
    const {listener,order,ticket,data,msg}=await setup();

    // call the onMessage method function with the data and message object
     await listener.onMessage(data,msg);

    //write assertions to check if the order status was updated
    const updatedOrder=await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

})

it('emits an order cancelled event', async () => {
    const {listener,order,ticket,data,msg}=await setup();

    // call the onMessage method function with the data and message object
     await listener.onMessage(data,msg);
    //write assertions to check if the order cancelled event was emitted
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toBe(order.id);
})

it('acknwoledges the message', async () => {
    const {listener,order,ticket,data,msg}=await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})
