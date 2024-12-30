import request from 'supertest';
import { app } from '../../app';
import { getCookieAfterSignIn } from '../../test/setup';
import { Order } from '../../model/order';
import mongoose from 'mongoose';
import { OrderStatus } from '@nkticket/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it("can only be acessed if the user is signed in" , async () => {
  await request(app).post('/api/payments').send({}).expect(401);
});

it("returns status other than 401 when the user is signed in" , async () => {
  const cookie = getCookieAfterSignIn();
  const response = await request(app).post('/api/payments')
  .set("Cookie" , cookie)
  .send({});
  expect(response.status).not.toEqual(401);
})

it("returns an error if token is not provided" , async () => {
  const cookie = getCookieAfterSignIn();
  const orderId = new mongoose.Types.ObjectId().toHexString();

  await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    token : "",
    orderId
  })
  .expect(400);
  
  await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    orderId
  })
  .expect(400);
});

it("returns an error if an orderId is not provided" , async () => {
  const cookie = getCookieAfterSignIn();
  await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    token : "concert",
    orderId : ""
  })
  .expect(400);

  await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    token : "concert",
  })
  .expect(400);
});

it("throws an error if an order cant be found with the given id" , async () => {
  //we are making request to check if the data in created and saved to mongodb but we are assuming that

  const cookie = getCookieAfterSignIn();
  const response = await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    token : "concert",
    orderId : new mongoose.Types.ObjectId().toHexString()
  })
  .expect(404);
});

it("throws an error if someone other than one who created the order is trying to pay for the order" , async () => {
  //first create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "0000000000",
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  const cookie = getCookieAfterSignIn();
  //now someone else will try to pay for this order
  await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    token : "token",
    orderId : order.id
  })
  .expect(401);
});

it("throws an error if someone tries to pay for an order that is cancelled" , async () => {
  //first create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "0000000000",
    price: 20,
    status: OrderStatus.Created
  });
  order.status = OrderStatus.Cancelled;
  await order.save();

  const cookie = getCookieAfterSignIn("0000000000");
  //now someone else will try to pay for this order
  await request(app).post("/api/payments")
  .set("Cookie" , cookie)
  .send({
    token : "token",
    orderId : order.id
  })
  .expect(400);
});


it("calls stripe.charges.create with correct arguments", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = getCookieAfterSignIn(userId);

  // Create an order in the database
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  // Make a request to the /api/payments endpoint
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa', // Stripe test token
      orderId: order.id
    })
    .expect(201);

  // Assert that stripe.charges.create was called
  expect(stripe.charges.create).toHaveBeenCalled();

  // Assert the correct arguments were passed
  expect(stripe.charges.create).toHaveBeenCalledWith({
    currency: 'usd',
    amount: order.price * 100,
    source: 'tok_visa'
  });
});