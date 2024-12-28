import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@nkticket/common";
import { Order } from "../../../model/order";

const setup = async () => {
  // Create an instance of the listener
  const kafka = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  };
  const listener = new OrderCreatedListener(kafka as any);

  // Mock topic and partition details
  const topic = "payment-topic";
  const partition = 0;

  return { listener, topic, partition };
};

it("check if the order has been created ", async () => {

  const { listener, topic, partition } = await setup();

  // Create fake data event
  const data : OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "123456789",
    expiresAt: new Date(Date.now()).toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20
    }
  };

  await listener.logReceivedData(data, topic, partition);

  //now check if the order has been created 
  const orderFound = await Order.findById(data.id);
  expect(orderFound!.id).toEqual(data.id);
  expect(orderFound!.version).toEqual(data.version);
  expect(orderFound!.status).toEqual(data.status);
  expect(orderFound!.price).toEqual(data.ticket.price);

});

