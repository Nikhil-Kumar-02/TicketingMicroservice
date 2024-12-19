import express , { Request , Response } from "express";
import { BadRequestError, NotFoundError, RequireAuth , validateRequest } from "@nkticket/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../model/ticket";
import { Order , OrderStatus } from "../model/orders";
import { KafkaManager } from "../kafkaManager";
import { OrderCreatedPublsiher } from "../events/publishers/order-created-publisher";

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
    const isReserved = await ticket.isReserved();

    if(isReserved){
      throw new BadRequestError("The ticket is already Reserved");
    }

    //calculate an expiration time for the order
    const expirationTime = new Date(Date.now() + 1000*60*15);

    //build the order and save it to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationTime,
      ticket
    })

    await order.save();

    //publish an event saying that an order has been created
    await new OrderCreatedPublsiher(KafkaManager.getProducer()).publishMessage({
      id: order.id,
      status: order.status,
      userId: req.currentUser!.id,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: +ticket.price
      },
      version: 0
    })
    return res.status(201).send(order);
})

export {router as createTicket};