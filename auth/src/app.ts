import express from "express";
import 'express-async-errors';
import {json} from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRoute } from "./routes/current-user";
import { signInRoute } from "./routes/signin";
import { signOutRoute } from "./routes/signout";
import { signUpRoute } from "./routes/sigup";
import { errorHandler , NotFoundError } from "@nkticket/common";

const app = express();
app.set("trust proxy" , true);

app.use(json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== "test",
}))

app.use(currentUserRoute);
app.use(signInRoute);
app.use(signOutRoute);
app.use(signUpRoute);

app.all('*' , ()=>{
  throw new NotFoundError();
})


app.use(errorHandler);

export { app };