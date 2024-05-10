import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout'
import useRequest from "../../hooks/use-request";
const Order = ({ order,currentUser }) => {
const [timeLeft,setTimeLeft]=useState(0);
const [avaiable,setAvaiable]=useState(true);
const {doRequest,errors}=useRequest(
   {
    url:'/api/payments',
    method:'post',
    body:{
        orderId:order.id
    },
    onSuccess:(order)=> {
        setAvaiable(false);
        Router.push(`/orders`);
    },
   }
);
const email=currentUser.email;
useEffect(()=>{
if(order.status==='complete'){
  setAvaiable(false);
}
const findTimeLeft=()=>{
  const expiryDate = new Date(order.expiresAt);
  const timeLeft=(expiryDate.getTime()-Date.now())
  setTimeLeft(Math.round(timeLeft/1000));
}   
    findTimeLeft();
  const interval=setInterval(findTimeLeft,1000);
  return ()=>{
    clearInterval(interval);
  };
},[]);


const OrderStatus=({status})=>{
  switch (status) {
    case 'created':
    case 'awaiting:payment':
      return <p>Awaiting Payment</p>;    
    case 'cancelled':
      return <p>Cancelled</p>;
    case 'complete':
      return <p>Complete</p>;
    default:
      return <p> Unknown Status</p>;
  }
}


  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <h4>Price: {order.ticket.price}</h4>
      <p>Order ID: {order.id}</p>
    {
       avaiable&&timeLeft>0?
        <div>
        <p>
            {timeLeft} seconds left until order expiry.
            
        </p>
        <StripeCheckout
            token={(token)=>doRequest({token:token.id})}
            stripeKey="pk_test_51Jsqn7BxmHhaMzUzIb93fD0CfUaekJnCmf9OFmJDIXLNotnZgBtQQMR08kl8IWob0MxyshFFeDHIevJ2ekhz5f5N00rlxGGbFn"
            amount={order.ticket.price*100}
            email={email}
            name={order.ticket.title}

        />
        {errors}
            </div>
        :
        <p>
          Order {timeLeft>0?OrderStatus(order.status):'has Expired'}
        </p>
    }
    </div>
  );
};

Order.getInitialProps = async (ctx,client) => {
    console.log(ctx);
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default Order;