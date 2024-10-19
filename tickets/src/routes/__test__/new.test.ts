import request from 'supertest';
import { app } from '../../app';
import { getCookieAfterSignIn } from '../../test/setup';

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
  console.log("the code  is " , response.status);
  expect(response.status).not.toEqual(401);
})

it("returns an error if an invalid title is provided" , async () => {

});

it("returns an error if an invalid price is provided" , async () => {

});

it("creates a tickets with valid inputs" , async () => {

});


