import express , {Request , Response} from 'express';
import { NotFoundError, RequireAuth, validateRequest , NotAuthorizedError } from '@nkticket/common';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';
import { body } from "express-validator";
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { KafkaManager } from '../kafkaManager';

const router = express.Router();

router.put("/api/tickets/:id" , RequireAuth ,
  [
    body('title')
    .not()
    .isEmpty()
    .withMessage("Enter a valid Title"),
    body("price")
      .trim()
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Price cant be empty and less than 0")
  ],
  validateRequest,

  async (req:Request , res:Response) => {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new NotFoundError();
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if(!ticket){
      throw new NotFoundError();
    }
    console.log(ticket.userId , req.currentUser!.id);
    //now see if the same user who created this ticket is trying to update it or not
    if(ticket.userId != req.currentUser!.id){
      console.log("the owner and requester are not the same");
      throw new NotAuthorizedError();
    }
    
    const { title , price } = req.body;
    //here means same user is trying to update the ticket
    //so update the ticket details and return 
    if(title){
      ticket.title = title;
    }
    if(price){
      ticket.price = price;
    }
    await ticket.save();

    await new TicketUpdatedPublisher(KafkaManager.getProducer()).publishMessage({
      id : ticket.id , 
      title : ticket.title,
      price : ticket.price,
      userId : ticket.userId,
      version : ticket.version
    })


    return res.status(200).send(ticket);
})

export {router as updateTicket};