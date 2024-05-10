import { OrderCreatedEvent, OrderStatus } from "@microservice-training/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"

const setup=()=>{
    const listener=new OrderCreatedListener(natsWrapper.client)

    const data:OrderCreatedEvent['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        userId:new mongoose.Types.ObjectId().toHexString(),
       version:0,
       expiredAt:'2020-01-01T00:00:00.000Z',
       status:OrderStatus.Create,
       ticket:{
           price:100,
           id:new mongoose.Types.ObjectId().toHexString(),
       }
    }
    // @ts-ignore
     const msg:Message={
        ack:jest.fn(),
     }

     return {listener,data,msg}
}

it('replicates the order info',async ()=>{
    const {listener,data,msg}=setup();
    await listener.onMessage(data,msg);

    const order=await Order.findById(data.id);

    expect(order).toBeDefined();
});

it('acks the message',async ()=>{
    const {listener,data,msg}=setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})