import express from "express";
import {json} from "body-parser";
import { currentUserRoute } from "./routes/current-user";

const app = express();
app.use(json());

app.use(currentUserRoute);

app.listen(3000 , () => {
  console.log("running auth on port 3000 !!!");
})