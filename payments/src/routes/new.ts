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

    const response = await stripe.charges.create({
      currency : 'usd',
      amount : order.price*100,
      source : token
    })

    console.log("stripe payment response is : " , response);

    const payment = Payment.build({
      orderId,
      stripeId: response.id,
    });
    
    await payment.save();

    await new PaymentCreatedPublsiher(KafkaManager.getProducer()).publishMessage({
      id: payment.id,
      orderId : payment.orderId,
      stripeId:payment.stripeId
    })

    res.status(201).send(payment);
  }
)

export {router as CreatePayment};