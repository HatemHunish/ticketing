import  Router  from "next/router";
import useRequest from "../../hooks/use-request";

const Ticket = ({ ticket }) => {
const {doRequest,errors}=useRequest(
   {
    url:'/api/orders',
    method:'post',
    body:{
        ticketId:ticket.id
    },
    onSuccess:(order)=> Router.push(`/orders/${order.id}`)
   }
);


  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={()=>doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

Ticket.getInitialProps = async (ctx,client) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default Ticket;