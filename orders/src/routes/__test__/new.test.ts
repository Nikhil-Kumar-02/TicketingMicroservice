import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getCookieAfterSignIn } from "../../test/setup";
import { Order , OrderStatus } from "../../model/orders";
import { Ticket } from "../../model/ticket";


it("can only be acessed if the user is signed in" , async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it("returns an error if the ticket user trying to order does not exits" , async () => {
  const cookie = getCookieAfterSignIn();
  const randomId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie" , cookie)
    .send({
      ticketId : randomId
    }).expect(404);

});

it("returns an error if the ticket user trying to order is already reserved" , async () => {
  //first create a ticket
  const ticketCreated = Ticket.build({
    title: "Coldplay:Ticket",
    price: 200
  })
  await ticketCreated.save();

  //now create an order and associate it with this ticket
  const orderCreated = Order.build({
    userId: "123456789",
    status: OrderStatus.Created,
    expiresAt: new Date(Date.now() + 1000*60*15),
    ticket: ticketCreated
  })
  await orderCreated.save();

  //now try to book this ticket which is already in line of being booked
  const cookie = getCookieAfterSignIn();

  await request(app)
    .post("/api/orders")
    .set("Cookie" , cookie)
    .send({
      ticketId : ticketCreated._id
    }).expect(400);

});

it("reserves a ticket to mark that ticket a status of created" , async () => {
  //first create a ticket
  const ticketCreated = Ticket.build({
    title: "Coldplay:Ticket",
    price: 200
  })
  await ticketCreated.save();

  const cookie = getCookieAfterSignIn();

  await request(app)
    .post("/api/orders")
    .set("Cookie" , cookie)
    .send({
      ticketId : ticketCreated._id
    }).expect(201);

});

it.todo("emits an order created event");