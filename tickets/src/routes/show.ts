import express , {Request , Response} from 'express';
import { NotFoundError } from '@nkticket/common';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

const router = express.Router();

router.get("/api/tickets/:id" ,
  async (req:Request , res:Response) => {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new NotFoundError();
    }

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
      return new NotFoundError();
    }

    return res.status(200).send(ticket);
})

export {router as showTicket};