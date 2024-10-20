import express , {Request , Response} from 'express';
import { RequireAuth , validateRequest } from '@nkticket/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get("/api/tickets" , async (req :Request , res :Response) => {
  const result = await Ticket.find();
  return res.status(200).send(result);
})

export {router as getAllTickets};