import { Listener , OrderCreatedEvent, Subjects } from "@nkticket/common";
import { Consumer, Kafka } from "kafkajs";
import { Order } from "../../model/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  topicName: Subjects.OrderCreated = Subjects.OrderCreated;
  groupName = "payment-service-order-created";
  consumer: Consumer;

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: OrderCreatedEvent["data"], topic: string, partition: number) {
    console.log("Received OrderCreatedEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);

    //create a order for this service
    const order = Order.build({
      id: data.id,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status
    })

    await order.save();  
    
  }

  validateMessage(data: any): data is OrderCreatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.status === "string" &&
      typeof data.userId === "string" &&
      typeof data.expiresAt === "string" &&
      typeof data.version === "number" &&
      data.ticket &&
      typeof data.ticket.id === "string" &&
      typeof data.ticket.price === "number"
    );
  }

}