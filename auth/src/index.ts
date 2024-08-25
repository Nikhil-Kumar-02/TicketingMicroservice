import express from "express";
import {json} from "body-parser";
import mongoose from "mongoose";

import { currentUserRoute } from "./routes/current-user";
import { signInRoute } from "./routes/signin";
import { signOutRoute } from "./routes/signout";
import { signUpRoute } from "./routes/sigup";
import { errorHandler } from "./middlewares/err-handler";
import { NotFoundError } from "./errors/notFoundError";

const app = express();
app.use(json());

app.use(currentUserRoute);
app.use(signInRoute);
app.use(signOutRoute);
app.use(signUpRoute);

app.all('*' , ()=>{
  throw new NotFoundError();
})

app.use(errorHandler);

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