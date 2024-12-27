import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket } from "../../../model/ticket"; 
import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@nkticket/common";
import { Order } from "../../../model/orders";
import { OrderCancelledPublsiher } from "../../publishers/order-cancelled-publisher";

jest.mock("../../publishers/order-cancelled-publisher");

const setup = async () => {
  // Create an instance of the listener
  const kafka = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  };
  const listener = new ExpirationCompleteListener(kafka as any);

  // Mock topic and partition details
  const topic = "Expiration-topic";
  const partition = 0;

    //first create a ticket
    const ticketCreated = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "old concert",
      price: 100,
    });
    await ticketCreated.save();
  
    const orderCreated = Order.build({
      userId: "987654321",
      status: OrderStatus.Created,
      expiresAt: new Date(),
      ticket: ticketCreated.id
    })
    await orderCreated.save();

  return { listener, topic, partition , ticketCreated , orderCreated };
};

it("throws an error if the order that has expired is not found", async () => {

  const { listener, topic, partition } = await setup();

  // Create fake data event
  const data : ExpirationCompleteEvent['data'] = {
    orderId : new mongoose.Types.ObjectId().toHexString()
  };

  try {
    await listener.logReceivedData(data, topic, partition);
  } catch (error) {
    return;
  }

  throw new Error("order should not have been found for this order id");
});

it("marks the status of order as cancelled " , async () => {
  const { listener, topic, partition , orderCreated} = await setup();

  const data : ExpirationCompleteEvent['data'] = {
    orderId : orderCreated.id
  };

  await listener.logReceivedData(data, topic, partition);

  const order =await Order.findById(orderCreated.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);

});

it("checks if the OrderCancelledPublisher event has been published", async () => {
  const { listener, topic, partition } = await setup();

  const ticketCreated = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "old concert",
    price: 100,
  });
  await ticketCreated.save();

  const orderCreated = Order.build({
    userId: "987654321",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticketCreated.id
  })
  await orderCreated.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: orderCreated.id,
  };

  await listener.logReceivedData(data, topic, partition);

  const updatedOrder = await Order.findById(orderCreated.id);
  console.log("Updated Order:", updatedOrder);

  // Check if the publishMessage method was called
  expect(OrderCancelledPublsiher.prototype.publishMessage).toHaveBeenCalled();
  
  // Optionally, check the arguments passed to the publishMessage method
  expect(OrderCancelledPublsiher.prototype.publishMessage).toHaveBeenCalledWith({
    id: orderCreated.id,
    version: updatedOrder!.version,
    ticket: {
      id: orderCreated.ticket.toString(),
    },
  });
});