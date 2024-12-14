import { NotAuthorizedError, NotFoundError, RequireAuth, validateRequest } from "@nkticket/common";
import express , { Request , Response } from "express";
import { Order } from "../model/orders";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get('/api/orders/:orderId' ,
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
  
  //a user can see only his orders so this user can request to see someone elses orders
  const order = await Order.findById(orderId).populate("ticket");

  if(!order){
    throw new NotFoundError();
  }

  if(order?.userId != req.currentUser!.id){
    throw new NotAuthorizedError();
  }

  //so this user is the real owen of this order so we will send him the full details of this order
  return res.status(200).send(order);

})

export {router as showTicket};