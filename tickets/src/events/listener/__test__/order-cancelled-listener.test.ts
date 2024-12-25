import mongoose from "mongoose";
import { OrderCancelledEvent } from "@nkticket/common";
import { getCookieAfterSignIn } from "../../../test/setup";
import request from "supertest";
import { app } from "../../../app";
import { Ticket } from "../../../models/ticket";
import { KafkaManager } from "../../../kafkaManager";
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () => {
  // Create an instance of the listener
  const kafka = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  };
  const listener = new OrderCancelledListener(kafka as any);

  // Create fake data event
  const data : OrderCancelledEvent['data']= {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    }
  };

  // Mock topic and partition details
  const topic = "ticket-service-order-cancelled";
  const partition = 0;

  return { listener, data, topic, partition };
};

it("throws an error when order is cancelled on ticket and the ticket is not found" , async () => {
  const { listener, data, topic, partition } = await setup();

  try{
    await listener.logReceivedData(data, topic, partition);
  }
  catch(err){
    return;
  }

  throw new Error("Ticket not found error was expected");

});

it("sets the order id to undefined for a certain ticket and sucessfully increases the version of the ticket" , async () => {

  //first create a ticket in this model
  const cookie = getCookieAfterSignIn();
  const ticket = await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    title : "concert",
    price : 10
  })
  .expect(201);
  expect(ticket.body.version).toEqual(0);
  expect(ticket.body.orderId).toBeUndefined();

  //now recieve a order created event for this ticket and increase the version of ticket
  const { listener, data, topic, partition } = await setup();

  data.ticket.id = ticket.body.id;

  await listener.logReceivedData(data, topic, partition);

  const ticketfound = await Ticket.findById(data.ticket.id);
  expect(ticketfound?.version).toEqual(1);
  expect(ticketfound?.orderId).toBeUndefined();

})

it("checks if KafkaManager.getProducer is getting invoked or not" , async () => {
  //first create a ticket in this model
  const cookie = getCookieAfterSignIn();
  const ticket = await request(app).post("/api/tickets")
  .set("Cookie" , cookie)
  .send({
    title : "concert",
    price : 10
  })
  .expect(201);
  expect(ticket.body.version).toEqual(0);
  expect(ticket.body.orderId).toBeUndefined();

  const { listener, data, topic, partition } = await setup();

  data.ticket.id = ticket.body.id;

  await listener.logReceivedData(data, topic, partition);

  
  expect(KafkaManager.getProducer).toHaveBeenCalled();

});
