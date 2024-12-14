import express , { Request , Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, RequireAuth , validateRequest } from "@nkticket/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../model/ticket";
import { Order } from "../model/orders";
const router = express.Router();

router.post('/api/orders' ,
  RequireAuth ,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId must be provided")
  ],
  validateRequest ,
  async (req : Request , res : Response) => {
    const {ticketId} = req.body;

    //find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    //if failed to find it then either that ticket has been purchased or not created to ERROR
    if(!ticket){
      throw new NotFoundError();
    }

    //make sure this ticket is not already reserved that is for 15min
    
    const existingOrder = await Order.findOne({
      ticket : ticket,
      status : {
        $in : [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    })

    const existingOrder = await ticket.isReserved();

    if(existingOrder){
      throw new BadRequestError("The ticket is already Reserved");
    }

    //calculate an expiration time for the order


    //build the order and save it to database

    //publish an event saying that an order has been created
  return res.status(201).send({});
})

export {router as createTicket};