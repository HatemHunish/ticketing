import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { Listener, Subjects, TicketUpdatedEvent } from "@microservice-training/common";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
   readonly subject=Subjects.TicketUpdated;
    queueGroupName=queueGroupName
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const ticket=await Ticket.findByEvent(data);
        if(!ticket){
            throw new Error('Ticket not found')
        }
       const {title,price,version}=data;
       ticket.set({title
        ,price
       })
        await ticket.save();

        msg.ack();
}
}