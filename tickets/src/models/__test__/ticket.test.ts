import { Ticket } from "../ticket";

it('implements optimistic concurrency control',async ()=>{
const ticket=new Ticket({
    title:'shoot',
    price:5,
    userId:'123'
});

await ticket.save();

const ticket1=await Ticket.findById(ticket.id)
const ticket2=await Ticket.findById(ticket.id)

ticket1?.set({price:10});
ticket2?.set({price:15});

await ticket1?.save()

try {
    await ticket2?.save()
} catch (error) {
    return;
}
throw new Error('Should not reach this point')
});

it('increment the version number on multiple saves',async()=>{
    const ticket=new Ticket({
        price:10, 
        title:'Halloa',
        userId:'1314'
    });

   await ticket.save();

   expect(ticket.version).toEqual(0)
   
   await ticket.save();
   expect(ticket.version).toEqual(1)
   
   await ticket.save();
   expect(ticket.version).toEqual(2)
});
