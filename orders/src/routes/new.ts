import express , { Request , Response } from "express";
import { RequireAuth , validateRequest } from "@nkticket/common";
import { body } from "express-validator";
import mongoose from "mongoose";
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
  return res.status(201).send({});
})

export {router as createTicket};