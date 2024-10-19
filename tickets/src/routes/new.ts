import express , {Request , Response} from 'express';
import { RequireAuth } from '@nkticket/common';

const router = express.Router();

router.post("/api/tickets" , RequireAuth , async (req:Request , res:Response) => {
  console.log("inside new router");
  return res.sendStatus(200);
})

export {router as createTicket};