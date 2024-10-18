import express from "express";
const router = express.Router();
import { currentUser } from "@nkticket/common";


router.get("/api/users/currentUser" , currentUser , (req,res) => {
  return res.send({currentUser: req.currentUser||null});

})

export { router as currentUserRoute };