import { useEffect, useState } from "react";

const OrderShow = ({order}) => {
  const [timeLeft , setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {timeLeft === 0 ? (
        <h1>Order Expired</h1>
      ) : (
        <h1>Inside the order show page - {timeLeft}</h1>
      )}
    </>
  );
  
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;