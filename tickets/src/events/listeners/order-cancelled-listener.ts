import { Listener, OrderCancelledEvent, OrderCreatedEvent, Subjects } from "@microservice-training/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject=Subjects.OrderCancelled;

    queueGroupName=queueGroupName;

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        // Find the ticket that the order is reserving 

        const ticket=await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error(`Ticket with id ${data.id} not found`);
        }

        ticket.set({orderId:undefined});

        await ticket.save();
       await  new TicketUpdatedPublisher(natsWrapper.client).publish({
            id:ticket.id,
            version:ticket.version,
            orderId:undefined,
            price:ticket.price,
            userId:ticket.userId,
            title:ticket.title,
        });

        msg.ack();
    }
}