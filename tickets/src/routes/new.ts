import express , {Request , Response} from 'express';
import { RequireAuth , validateRequest } from '@nkticket/common';
import { body } from "express-validator";

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
  console.log("inside new router");
  return res.sendStatus(201);
})

export {router as createTicket};