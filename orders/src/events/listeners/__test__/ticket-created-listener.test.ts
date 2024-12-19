import { TicketCreatedListener } from "../ticket-created-listener"; 
import { Ticket } from "../../../model/ticket"; 
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@nkticket/common";


const setup = async () => {
  // Create an instance of the listener
  const kafka = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  };
  const listener = new TicketCreatedListener(kafka as any);

  // Create fake data event
  const data : TicketCreatedEvent['data']= {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
    version : 0
  };

  // Mock topic and partition details
  const topic = "ticket-created-topic";
  const partition = 0;

  return { listener, data, topic, partition };
};

it("creates and saves a ticket", async () => {
  const { listener, data, topic, partition } = await setup();

  // Call the logReceivedData function (simulate message processing)
  await listener.logReceivedData(data, topic, partition);

  // Assert that the ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).not.toBeNull();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

// it("acks the message", async () => {
//   const { listener, data, topic, partition } = await setup();

//   // Spy on the acknowledgment logic if implemented
//   const ackSpy = jest.fn();
//   listener.consumer.run = jest.fn(async ({ eachMessage }: any) => {
//     await eachMessage({
//       topic,
//       partition,
//       message: {
//         value: JSON.stringify(data),
//       },
//     });
//   });

//   await listener.consumer.run({
//     eachMessage: async ({ topic, partition, message }: any) => {
//       const parsedData = JSON.parse(message.value.toString());
//       await listener.logReceivedData(parsedData, topic, partition);
//       ackSpy();
//     },
//   });

//   // Assert that acknowledgment was called
//   expect(ackSpy).toHaveBeenCalled();
// });
