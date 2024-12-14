import { RequireAuth} from "@nkticket/common";
import express , { Request , Response } from "express";
import { Order } from "../model/orders";

const router = express.Router();

router.get('/api/orders' ,
  RequireAuth,
  async (req : Request , res : Response) => {

    const allOrders = await Order.find({userId : req.currentUser!.id}).populate("ticket");

    return res.status(200).send(allOrders);
  })

export {router as getAllTickets};