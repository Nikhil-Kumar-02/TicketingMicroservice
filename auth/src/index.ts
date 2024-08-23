import express from "express";

import {json} from "body-parser";

const app = express();
app.use(json());

app.get("/api/users/currentUser" , (req,res) => {
  res.send("hello from backend");
})

app.listen(3000 , () => {
  console.log("running auth on port 3000 !!!");
})