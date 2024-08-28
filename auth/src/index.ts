import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (err) {
    console.error(err);
  }
  console.log('connected to mongodb');
  app.listen(3000 , () => {
    console.log("running auth on port 3000 !!!");
  })

}

start();