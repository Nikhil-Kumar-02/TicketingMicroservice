import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../model/ticket"; 
import mongoose, { mongo } from "mongoose";
import { TicketUpdatedEvent } from "@nkticket/common";


const setup = async () => {
  // Create an instance of the listener
  const kafka = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  };
  const listener = new TicketUpdatedListener(kafka as any);

  // Mock topic and partition details
  const topic = "ticket-updated-topic";
  const partition = 0;

  return { listener, topic, partition };
};

it("creates and saves a ticket", async () => {
  
  //first create a ticket
  const ticketCreated = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "old concert",
    price: 100,
  });
  await ticketCreated.save();

  // Create fake data event
  const data : TicketUpdatedEvent['data'] = {
    id: ticketCreated.id,
    title: "Concert",
    price: 20,
    version : ticketCreated.version+1
  };
  
  const { listener, topic, partition } = await setup();

  // Call the logReceivedData function (simulate message processing)
  await listener.logReceivedData(data, topic, partition);

  // Assert that the ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).not.toBeNull();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it("fails if we are updating the ticket with wrong version number" , async () => {
  //first create a ticket
  const ticketCreated = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "old concert",
    price: 100,
  });
  await ticketCreated.save();

  // Create fake data event
  const data = {
    id: ticketCreated.id,
    title: "Concert",
    price: 20,
    version : ticketCreated.version+2
  };

  const { listener, topic, partition } = await setup();

  // Call the logReceivedData function (simulate message processing)
  try{
    await listener.logReceivedData(data, topic, partition);
  }
  catch(err){
    return;
  }

  throw new Error("Ticket not found error was expected");
});

it("fails for ticket with wrong version and passes if the versions are in order" , async () => {
  //first create a ticket
  const ticketCreated = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "old concert",
    price: 100,
  });
  await ticketCreated.save();

  // Create fake data event
  const data1 = {
    id: ticketCreated.id,
    title: "Concert1",
    price: 201,
    version : ticketCreated.version+1
  };

  const data2 = {
    id: ticketCreated.id,
    title: "Concert2",
    price: 202,
    version : ticketCreated.version+2
  };

  const { listener, topic, partition } = await setup();

  // Call the logReceivedData function (simulate message processing)
  try{
    await listener.logReceivedData(data2, topic, partition);
  }
  catch(err){
    await listener.logReceivedData(data1, topic, partition);
    await listener.logReceivedData(data2, topic, partition);

    // Assert that the ticket was updated
    const ticket = await Ticket.findById(data2.id);
    expect(ticket).not.toBeNull();
    expect(ticket!.title).toEqual(data2.title);
    expect(ticket!.price).toEqual(data2.price);
    expect(ticket!.version).toEqual(data2.version);

    return;
  }

  throw new Error("Ticket not found error was expected");
});