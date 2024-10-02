import express from "express";
const router = express.Router();
import { currentUser } from "../middlewares/current-user";


router.get("/api/users/currentUser" , currentUser , (req,res) => {
  return res.send({currentUser: req.currentUser||null});

})

export { router as currentUserRoute };