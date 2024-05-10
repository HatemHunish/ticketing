import { TicketCreatedEvent } from "@microservice-training/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

 

const setup=async ()=>{
        //create an instance of the listener
        const listener=new TicketCreatedListener(natsWrapper.client);
        
    //create a fake data event  
    const data:TicketCreatedEvent['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'test',
        price:10,
        version:0,
        userId:new mongoose.Types.ObjectId().toHexString(),
      };
    //create a fake message object
    // @ts-ignore
     const msg:Message={
        ack:jest.fn(),
    }

    return {listener,data,msg}
}

 it('creates and save a ticket', async () => {

     const {listener,data,msg}=await setup();



    // call the onMessage method function with the data and message object
     await listener.onMessage(data,msg);
    //write assertions to check if the ticket was created and saved
    const ticket=await Ticket.findById(data.id);
    expect(ticket).toBeTruthy();
    expect(ticket!.title).toBe(data.title);
    expect(ticket!.price).toBe(data.price);

})

it('acknwoledges the message', async () => {
    const {listener,data,msg}=await setup();


    // call the onMessage method function with the data and message object
     await listener.onMessage(data,msg);
    //write assertions to check if the message was acknwoledged
    expect(msg.ack).toHaveBeenCalled();
})


