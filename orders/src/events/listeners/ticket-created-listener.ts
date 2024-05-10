import { Message } from "node-nats-streaming";
import { Subjects,Listener,TicketCreatedEvent } from "@microservice-training/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
   readonly subject=Subjects.TicketCreated;
    queueGroupName=queueGroupName
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const {id,title,price}=data;
        const ticket=  Ticket.build({
            price,title,id
        })
        await ticket.save();

        msg.ack();
}
}