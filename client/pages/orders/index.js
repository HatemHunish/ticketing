import Link from "next/link";

const OrdersPage = ({orders}) => {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/orders/${order.id}`}>
              {order.ticket.title} - {order.status}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
};

OrdersPage.getInitialProps = async (ctx,client) => {
    const { data } = await client.get(`/api/orders`);
    return { orders: data };
  };

export default OrdersPage;