import express , {Request , Response} from 'express';
import { RequireAuth , validateRequest } from '@nkticket/common';
import { body } from "express-validator";
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { KafkaManager } from '../kafkaManager';

const router = express.Router();

router.post("/api/tickets" , RequireAuth ,
  [
    body('title')
    .notEmpty()
    .withMessage("Enter a valid Title"),
    body("price")
      .trim()
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Price cant be empty and less than 0")
  ],
  validateRequest,
  async (req:Request , res:Response) => {
    const { title , price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId : req.currentUser!.id
    });

    await ticket.save();

    await new TicketCreatedPublisher(KafkaManager.getProducer()).publishMessage({
      id : ticket.id , 
      title : ticket.title,
      price : ticket.price,
      userId : ticket.userId,
      version : ticket.version
    })

    return res.status(201).send(ticket);
})

export {router as createTicket};