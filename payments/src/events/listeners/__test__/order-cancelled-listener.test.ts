import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@microservice-training/common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup=async()=>{
    const listener=new OrderCancelledListener(natsWrapper.client)

    const order=Order.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        userId:new mongoose.Types.ObjectId().toHexString(),
       version:0,
       status:OrderStatus.Create,
       price:100,
    })

    await order.save();
    const data:OrderCancelledEvent['data']={
        id:order.id,
       version:1,       
       ticket:{
           id:new mongoose.Types.ObjectId().toHexString(),
       }
    }
    // @ts-ignore
     const msg:Message={
        ack:jest.fn(),
     }

     return {listener,data,msg,order}
}

it('cancels the order',async ()=>{
    const {listener,data,msg}=await setup();
    await listener.onMessage(data,msg);

    const order=await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order?.status).toBe(OrderStatus.Cancelled);
});

it('acks the message',async ()=>{
    const {listener,data,msg}=await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})