import request from "supertest";
import { app } from "../../app";
import { getCookieAfterSignIn } from "../../test/setup";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";

it("retricts user to access endpoint if not authorised" , async () => {
  await request(app)
  .get("/api/orders").expect(401);
})

it("returns empty orders made by the user" , async () => {
  const cookie = getCookieAfterSignIn();
  const response = await request(app)
  .get("/api/orders")
  .set("Cookie" , cookie);

})

it("returns all orders created by the user" , async () => {
  const cookie = getCookieAfterSignIn();

  //first create an order
  //for that first create a ticket and then associate that ticket with the order
  const ticketCreated = Ticket.build({
    title: "Coldplay:Ticket",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticketCreated.save();

  await request(app)
  .post("/api/orders")
  .set("Cookie" , cookie)
  .send({ticketId : ticketCreated.id})
  .expect(201);
  
  const response = await request(app)
  .get("/api/orders")
  .set("Cookie" , cookie)
  .expect(200);

  expect(response.body.length).toEqual(1);
})

it("creates multiple ticket and orders but fetch order only specific to ticket" , async () => {

  //create three tickets
  const ticketCreated1 = Ticket.build({
    title: "Coldplay:Ticket1",
    price: 201,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticketCreated1.save();

  const ticketCreated2 = Ticket.build({
    title: "Coldplay:Ticket2",
    price: 202,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticketCreated2.save();

  const ticketCreated3 = Ticket.build({
    title: "Coldplay:Ticket3",
    price: 203,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticketCreated3.save();

  //create one order as User #1
  const cookie1 = getCookieAfterSignIn();
  await request(app)
  .post("/api/orders")
  .set("Cookie" , cookie1)
  .send({ticketId : ticketCreated1.id})
  .expect(201);

  //create two order as User #2
  const cookie2 = getCookieAfterSignIn();
  const {body:order1} = await request(app)
  .post("/api/orders")
  .set("Cookie" , cookie2)
  .send({ticketId : ticketCreated2.id})
  .expect(201);

  const {body:order2} = await request(app)
  .post("/api/orders")
  .set("Cookie" , cookie2)
  .send({ticketId : ticketCreated3.id})
  .expect(201);

  //make request to get orders only for user #2
  const response = await request(app)
                    .get("/api/orders")
                    .set("Cookie" , cookie2)
                    .expect(200);
  //make sure that we get the order only of User #2

  expect(response.body.length).toEqual(2);
  expect(response.body).toContainEqual(order1);
  expect(response.body).toContainEqual(order2);
})