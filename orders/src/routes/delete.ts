import { NotAuthorizedError, NotFoundError, OrderStatus, RequireAuth, validateRequest } from "@nkticket/common";
import express , { Request , Response } from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../model/orders";
import { OrderCancelledPublsiher } from "../events/publishers/order-cancelled-publisher";
import { KafkaManager } from "../kafkaManager";

const router = express.Router();

router.delete('/api/orders/:orderId' ,
  RequireAuth,
  [
    param('orderId')
      .not()
      .isEmpty()
      .withMessage('orderId must be provided')
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('orderId must be a valid MongoDB ObjectId'),
  ],
  validateRequest,
  async (req : Request , res : Response) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("ticket");

    if(!order){
      throw new NotFoundError();
    }
  
    if(order?.userId != req.currentUser!.id){
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish an event saythis this was cancelled
    await new OrderCancelledPublsiher(KafkaManager.getProducer()).publishMessage({
      id: order.id,
      ticket: {
        id: order.ticket.id
      },
      version: 0
    })
  
    return res.status(204).send(order);
})

export {router as deleteTicket};