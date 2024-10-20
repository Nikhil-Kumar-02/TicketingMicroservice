import request from 'supertest';
import { app } from '../../app';
import { getCookieAfterSignIn } from '../../test/setup';

const createTicket = async () => {
  const cookie = getCookieAfterSignIn();

  await request(app).post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "concert",
      price : 20
    })

}

it("returns all the tickets that has been created " , async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  //now check how many tickets i got
  const response = await request(app)
    .get("/api/tickets")
    .expect(200);

    expect(response.body.length).toEqual(5)
})