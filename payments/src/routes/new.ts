import express, { Request, Response } from 'express';
import { RequireAuth , BadRequestError , validateRequest , NotFoundError, NotAuthorizedError, OrderStatus } from '@nkticket/common';
import { Order } from '../model/order';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import { Payment } from '../model/payment';
import { PaymentCreatedPublsiher } from '../events/publisher/payment-created-publisher';
import { KafkaManager } from '../kafkaManager';

const router = express.Router();

router.post("/api/payments" ,
  RequireAuth,
  [
    body('token')
    .not()
    .isEmpty()
    .withMessage("Token is required"),
    body('orderId')
    .not()
    .isEmpty()
    .withMessage("orderId is required")
  ],
  validateRequest,
  async (req: Request , res: Response) => {

    const {token , orderId} = req.body;

    const order = await Order.findById(orderId);

    if(!order){
      throw new NotFoundError();
    }

    if(order.userId != req.currentUser?.id){
      throw new NotAuthorizedError();
    }

    if(order.status == OrderStatus.Cancelled){
      throw new BadRequestError("cannot pay for a cancelled order")
    }

    console.log("now i am starting to make payment")

    // Step 1: Create PaymentIntent with the amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100, // The amount in cents
      currency: 'usd',
      payment_method: token, // The token from frontend
      automatic_payment_methods: { enabled: true }, // Automatically handle payment methods
    });
    
    

    // console.log("Stripe Payment Intent response:", paymentIntent);

    // Step 2: Store payment details in the database
    const payment = Payment.build({
      orderId,
      stripeId: paymentIntent.id,
    });

    await payment.save();

    // Step 3: Publish payment details via Kafka
    await new PaymentCreatedPublsiher(KafkaManager.getProducer()).publishMessage({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send(payment);
  }
)

export {router as CreatePayment};