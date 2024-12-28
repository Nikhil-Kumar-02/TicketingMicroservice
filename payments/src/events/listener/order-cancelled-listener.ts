import { Listener , OrderCancelledEvent, OrderStatus, Subjects } from "@nkticket/common";
import { Consumer, Kafka } from "kafkajs";
import { Order } from "../../model/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
  topicName: Subjects.OrderCancelled = Subjects.OrderCancelled;
  groupName = "payment-service-order-cancelled";
  consumer: Consumer;

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: OrderCancelledEvent["data"], topic: string, partition: number) {
    console.log("Received OrderCancelledEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);

    const order = await Order.findOne({
      _id : data.id,
      version : data.version-1 
    })

    if(!order){
      throw new Error("Order not found while cancelling in the payment service")
    }

    order.set({status : OrderStatus.Cancelled});
    await order.save();
    
  }

  validateMessage(data: any): data is OrderCancelledEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.version === "number" &&
      data.ticket &&
      typeof data.ticket.id === "string"
    );
  }

}