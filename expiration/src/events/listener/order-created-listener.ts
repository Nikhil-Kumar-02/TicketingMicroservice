import { Listener , OrderCreatedEvent, Subjects } from "@nkticket/common";
import { Consumer, Kafka } from "kafkajs";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  topicName: Subjects.OrderCreated = Subjects.OrderCreated;
  groupName = "expiration-service-order-created";
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

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("the order will expire after : " , delay);

    await expirationQueue.add({orderId : data.id} , {delay : 30000});
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