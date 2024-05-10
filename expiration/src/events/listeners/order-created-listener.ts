import { Listener, OrderCancelledEvent, OrderCreatedEvent, Subjects } from "@microservice-training/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject=Subjects.OrderCreated;
    queueGroupName=queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay=new Date(data.expiredAt).getTime()-new Date().getTime();
        console.log("ORDER: ",data.id, "WILL BE EXPIRED IN",delay/1000,"SECONDS");
        await expirationQueue.add({orderId:data.id}
            ,{
                delay:delay
            }
        );
        msg.ack();
    }
}