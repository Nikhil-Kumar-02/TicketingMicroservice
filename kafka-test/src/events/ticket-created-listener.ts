import { Consumer, Kafka } from "kafkajs";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  consumer: Consumer;
  topicName: Subjects.TicketCreated = Subjects.TicketCreated;
  groupName = 'test-group';

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  logReceivedData(data: TicketCreatedEvent["data"], topic: string, partition: number) {
    console.log("Received TicketCreatedEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);
  }

  validateMessage(data: any): data is TicketCreatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.title === "string" &&
      typeof data.price === "number"
    );
  }
  
}
