import request from 'supertest';
import { app } from '../../app';
import { getCookieAfterSignIn } from '../../test/setup';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it("returns 404 if the provided id does not exists " , async () => {
  const cookie = getCookieAfterSignIn();

  await request(app)
  .put("/api/tickets/somerandomid")
  .set("Cookie" , cookie)
  .send({
    title : "concert",
    price: 10
  })
  .expect(404);
})

it("returns 401 if the user is not authenticated " , async () => {
    const cookie = getCookieAfterSignIn();
  //first let the user create a ticket 
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "concert",
      price: 10
    })
    .expect(201);

    const jsonResponse = JSON.parse(response.text);

    await request(app)
    .put(`/api/tickets/${jsonResponse.id}`)
    .send({
      title : "concert",
      price: 10
    })
    .expect(401);
})

it("returns 401 if the user does not own the ticket " , async () => {
  const cookie1 = getCookieAfterSignIn();
  //first let the user create a ticket 
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie1)
    .send({
      title : "concert",
      price: 10
    })
    .expect(201);

    const jsonResponse = JSON.parse(response.text);

    //now some other user will try to update this ticket and this is not allowed
    const cookie2 = getCookieAfterSignIn("1234567890");
    await request(app)
      .put(`/api/tickets/${jsonResponse.id}`)
      .set("Cookie" , cookie2)
      .send({
        title : "concert",
        price: 10
      })
      .expect(401);
})

it("returns 400 if the user provides invalid price or title " , async () => {
  const cookie = getCookieAfterSignIn();
  //first let the user create a ticket 
  await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "",
      price: 10
    })
    .expect(400);

    
  await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      price: 10
    })
    .expect(400);

    
  await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "concert",
      price: ""
    })
    .expect(400);

    
  await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "concert",
    })
    .expect(400);
    
})

it("updates the ticket if provied the valid input" , async () => {
  //first create a ticket
  const cookie = getCookieAfterSignIn();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "concert",
      price: 10
    })
    .expect(201);

    const jsonResponse = JSON.parse(ticket.text);

    //now the same authorized and authenticated user will try to update it
    await request(app)
    .put(`/api/tickets/${jsonResponse.id}`)
    .set("Cookie" , cookie)
    .send({
      title : "concerts",
      price : jsonResponse.price
    })
    .expect(200)
    
    
    await request(app)
    .put(`/api/tickets/${jsonResponse.id}`)
    .set("Cookie" , cookie)
    .send({
      title : jsonResponse.title,
      price : 200
    })
    .expect(200)
    
    await request(app)
    .put(`/api/tickets/${jsonResponse.id}`)
    .set("Cookie" , cookie)
    .send({
      title : "final Update",
      price : 100000
    })
    .expect(200)
    

})

it("will not allow to edit the ticket if it is reserved " , async () => {
  //first create a ticket
  const cookie = getCookieAfterSignIn();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie" , cookie)
    .send({
      title : "avengers",
      price: 90
    })

    const ticketfound = await Ticket.findById(ticket.body.id);

    ticketfound?.set({orderId : new mongoose.Types.ObjectId().toHexString()})
    await ticketfound?.save();

    await request(app)
      .put(`/api/tickets/${ticketfound!.id}`)
      .set("Cookie" , cookie)
      .send({
        title : "final Update",
        price : 100000
      })
      .expect(400)
  
})


