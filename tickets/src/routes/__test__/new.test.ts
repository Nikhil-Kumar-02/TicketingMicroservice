import request from 'supertest';
import { app } from '../../app';
import { getCookieAfterSignIn } from '../../test/setup';
import { Ticket } from '../../models/ticket';

it("has a route handler listenining to /api/tickets for post requests" , async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it("can only be acessed if the user is signed in" , async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it("returns status other than 401 when the user is signed in" , async () => {
  const cookie = getCookieAfterSignIn();
  const response = await request(app).post('/api/tickets')
  .set("Cookie" , cookie)
  .send({});
  expect(response.status).not.toEqual(401);
})

it("returns an error if an invalid title is provided" , async () => {
  const cookie = getCookieAfterSignIn();
  await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    title : "",
    price : 10
  })
  .expect(400);
  
  await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    price : 10
  })
  .expect(400);
});

it("returns an error if an invalid price is provided" , async () => {
  const cookie = getCookieAfterSignIn();
  await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    title : "concert",
    price : -10
  })
  .expect(400);

  await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    title : "concert",
  })
  .expect(400);
});

it("creates a tickets with valid inputs" , async () => {
  //we are making request to check if the data in created and saved to mongodb but we are assuming that
  //data is created and saved to db
  let ticket = await Ticket.find();
  expect(ticket.length).toEqual(0);

  const cookie = getCookieAfterSignIn();
  await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    title : "concert",
    price : 10
  })
  .expect(201);

  ticket = await Ticket.find();
  
  expect(ticket.length).toEqual(1);
  expect(ticket[0].price).toEqual(10);
  expect(ticket[0].title).toEqual("concert");
});


