import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@nkticket/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
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
  const listener = new OrderCancelledListener(kafka as any);

  // Create fake data event
  const data : OrderCancelledEvent['data']= {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    }
  };

  // Mock topic and partition details
  const topic = "payment-service-order-cancelled";
  const partition = 0;

  return { listener, data, topic, partition };
};

it("throws an error when order is cancelled for an order that does not exists" , async () => {
  const { listener, data, topic, partition } = await setup();

  try{
    await listener.logReceivedData(data, topic, partition);
  }
  catch(err){
    return;
  }

  throw new Error("Ticket not found error was expected");

});

it("checks if the order status got changed to cancelled or not" , async () => {

  //first create a ticket in this model
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "123456789",
    price: 10,
    status: OrderStatus.Created
  });
  await order.save();

  console.log("the order created is : " , order);

  //now recieve a order created event for this ticket and increase the version of ticket
  const { listener, data, topic, partition } = await setup();

  data.id = order.id;

  await listener.logReceivedData(data, topic, partition);

  const orderfound = await Order.findById(data.id);

  console.log("the order found is : " , orderfound);

  expect(orderfound?.version).toEqual(1);
  expect(orderfound?.status).toEqual(OrderStatus.Cancelled);

})