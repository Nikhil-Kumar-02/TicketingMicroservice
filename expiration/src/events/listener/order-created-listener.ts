import { Listener , OrderCreatedEvent, Subjects } from "@nkticket/common";
import { Consumer, Kafka } from "kafkajs";

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

  
  }

  validateMessage(data: any): data is OrderCreatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.title === "string" &&
      typeof data.price === "number"
    );
  }

}