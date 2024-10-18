import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if(!process.env.MONGO_URI){
    throw new Error("MONGO URI must be defined")
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }
  console.log('connected to mongodb');
  app.listen(3000 , () => {
    console.log("running auth on port 3000 !!!");
  })

}

start();