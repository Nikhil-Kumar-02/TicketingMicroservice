import express from "express";
import 'express-async-errors';
import {json} from "body-parser";
import cookieSession from "cookie-session";
import { createTicket } from "./routes/new";
import { showTicket } from "./routes/show";
import { errorHandler , NotFoundError , currentUser } from "@nkticket/common";
import { getAllTickets } from "./routes";
import { updateTicket } from "./routes/update";

const app = express();
app.set("trust proxy" , true);

app.use(json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== "test",
}))

app.use(currentUser);
app.use(createTicket);
app.use(showTicket);
app.use(getAllTickets);
app.use(updateTicket);

app.all('*' , ()=>{
  throw new NotFoundError();
})


app.use(errorHandler);

export { app };