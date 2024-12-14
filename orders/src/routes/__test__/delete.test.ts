import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { getCookieAfterSignIn } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/orders";

it("requires you to be authenticated to acess the route" , async () => {
  await request(app)
  .delete("/api/orders/12345")
  .expect(401);
});

// it("does not allow you to acess if orderId is not provided" , async () => {
//   const cookie = getCookieAfterSignIn();
//   const response = await request(app)
//   .delete(`/api/orders/`)
//   .set("Cookie" , cookie)
//   .expect(200);

// });

it("does not allow you to acess if orderId is not correct mongoose object" , async () => {
  const cookie = getCookieAfterSignIn();
  await request(app)
  .delete(`/api/orders/123456789`)
  .set("Cookie" , cookie)
  .expect(400);

});

it("returns error if no order with provided id exists" , async () => {
  const cookie = getCookieAfterSignIn();
  await request(app)
  .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
  .set("Cookie" , cookie)
  .expect(404);

});

it("it doesnt allow you to delete someones elses order" , async () => {
  //create a ticket and an order as user #1
  const ticketCreated = Ticket.build({
    title: "Coldplay:Ticket",
    price: 20
  });
  await ticketCreated.save();

  const cookie1 = getCookieAfterSignIn();
  const orderCreated = await request(app)
                      .post("/api/orders")
                      .set("Cookie" , cookie1)
                      .send({ticketId : ticketCreated.id})
                      .expect(201);


  //try to acess the ticket as user #2
  const cookie2 = getCookieAfterSignIn();
  await request(app)
  .delete(`/api/orders/${orderCreated.body.id}`)
  .set("Cookie" , cookie2)
  .expect(401);
});

it("it allow you to delete your orders" , async () => {
  //create a ticket and an order as user #1
  const ticketCreated = Ticket.build({
    title: "Coldplay:Ticket",
    price: 20
  });
  await ticketCreated.save();

  const cookie = getCookieAfterSignIn();
  const orderCreated = await request(app)
                      .post("/api/orders")
                      .set("Cookie" , cookie)
                      .send({ticketId : ticketCreated.id})
                      .expect(201);


  //try to acess the ticket as user #1
  await request(app)
  .delete(`/api/orders/${orderCreated.body.id}`)
  .set("Cookie" , cookie)
  .expect(204);

  const updatedStatus = await Order.findById(orderCreated.body.id);
  expect(updatedStatus?.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order cancelled event");