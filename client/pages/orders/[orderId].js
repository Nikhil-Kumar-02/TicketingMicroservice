import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useRequest from "../../hooks/use-Request";

const stripePromise = loadStripe('pk_test_51QbMpQFQk2WQ8stl6VBbqLx5pvU9Ji1QCT1Ia5iSfOhTnZz42MIeFxrRje8L8v28uwDlmjiioAktE2JNhIjtrYsK009l15qhtK');

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(90);

  const [ makeRequest , errors ] = useRequest("post",'/api/payments',{orderId: order.id},(payment)=>console.log(payment));

  useEffect(() => {
    const timer = setTimeout( ()=> {
      setTimeLeft(0);
    } , 90000)

    return () => clearTimeout(timer)
  } , [])

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        return; // Stripe.js has not loaded yet
      }

      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Payment Error:", error.message);
      } else {
        console.log('Payment Method:', paymentMethod);
        makeRequest({token:paymentMethod.id});

      } 
    };

    return (
      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <div className="mb-3">
          <label className="form-label">Card Details</label>
          <div className="form-control">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={!stripe}>
          Pay ${order.ticket.price}
        </button>
      </form>
    );
  };

  return (
    <>
      {timeLeft === 0 ? (
        <h1 className="text-danger">Order Expired</h1>
      ) : (
        <div className="container mt-5">
          <h1>Inside the order show page - {timeLeft}s</h1>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>

          {/* Error Messages */}
          {errors && errors.length > 0 && (
            <div className="alert alert-danger mb-4">
              <h6>Ooops....</h6>
              {errors.map((error, index) => (
                <div key={index}>{error.message}</div>
              ))}
            </div>
          )}
        </div>
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