import Link from "next/link";
import buildClient from "../api/build-client";

function LandingPage({ currentUser,tickets }) {
  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`}>
          View
        </Link>
      </td>
    </tr>
  ))
  return <div>
    <h1>Tickets</h1>
    <table className="table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {ticketList} 
    </tbody>


    </table>
  </div>
}

LandingPage.getInitialProps = async (ctx,client,currentUser) => {
 const {data}=await client.get('/api/tickets');
 return {tickets:data}
};

export default LandingPage;
