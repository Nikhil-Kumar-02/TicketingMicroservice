import express, { Request, Response } from 'express';
import { RequireAuth , BadRequestError , validateRequest , NotFoundError, NotAuthorizedError, OrderStatus } from '@nkticket/common';
import { Order } from '../model/order';
import { body } from 'express-validator';

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



    res.send({sucess : true});
  }
)

export {router as CreatePayment};