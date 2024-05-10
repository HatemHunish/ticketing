import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@microservice-training/common";

const setup=async ()=>{
        //create an instance of the listener
        const listener=new TicketUpdatedListener(natsWrapper.client);
    // create and save a ticket
    const ticket=await Ticket.build({
        title:'concert',
        price:10,
        id:new mongoose.Types.ObjectId().toHexString(),
      });
    await ticket.save();

    // create a fake data object
    const data:TicketUpdatedEvent['data']={
        id:ticket.id,
        title:'concert-updated',
        price:20,
        version:ticket.version+1,
        userId:new mongoose.Types.ObjectId().toHexString(),
      };
    //create a fake message object
    // @ts-ignore
    const msg:Message={
        ack:jest.fn(),
    }
    return {listener,data,msg,ticket}


}

it('finds , updates and saves a ticket', async () => {

     const {listener,data,msg,ticket}=await setup();



    // call the onMessage method function with the data and message object
     await listener.onMessage(data,msg);
    //write assertions to check if the ticket was created and saved
    const ticketUpdated=await Ticket.findById(ticket.id);
    expect(ticketUpdated).toBeTruthy();
    expect(ticketUpdated!.title).toBe(data.title);
    expect(ticketUpdated!.price).toBe(data.price);
    expect(ticketUpdated!.version).toBe(data.version);


})

it('acknwoledges the message', async () => {
    const {listener,data,msg}=await setup();


    // call the onMessage method function with the data and message object
     await listener.onMessage(data,msg);
    //write assertions to check if the message was acknwoledged
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped version number', async () => {
    const {listener,data,msg,ticket}=await setup();
    data.version=20;
    try{
        await listener.onMessage(data,msg);
    }
    catch(e){
        console.log(e)
    }
    expect(msg.ack).not.toHaveBeenCalled();
})