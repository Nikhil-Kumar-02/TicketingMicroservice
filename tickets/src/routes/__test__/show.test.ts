import request from 'supertest';
import { app } from '../../app';
import { getCookieAfterSignIn } from '../../test/setup';

it("returns a 404 if the ticket is not found " , async () => {
  await request(app).get('/api/tickets/randomid').expect(404);
});

it("returns the ticket if it is found " , async () => {
  const cookie = getCookieAfterSignIn();

  const response = await request(app).post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "concert",
      price : 20
    })
    .expect(201);

    const data = await JSON.parse(response.text);
    const ticketResponse = await request(app)
      .get(`/api/tickets/${data.id}`)
      .expect(200);

});