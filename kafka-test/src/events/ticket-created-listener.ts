import { Consumer, Kafka } from "kafkajs";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  consumer: Consumer;
  topicName: Subjects.TicketCreated = Subjects.TicketCreated;
  groupName = 'test-group';

  constructor(kafka: Kafka) {
    super(kafka);
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  logRecievedData(data: TicketCreatedEvent["data"], topic: string, partition: number) {
    console.log('Event data!', data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    console.log(topic);
    console.log(partition);
  }

  listenToMessages = async () => {
    try {
      await this.setupTopic();
      await this.consumer.connect();

      const topic = this.topicName;
      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();

          if (value) {
            try {
              const parsedData: unknown = JSON.parse(value);

              if (this.isTicketCreatedEventData(parsedData)) {
                this.logRecievedData(parsedData, topic, partition);
              } else {
                console.error("Received data does not match TicketCreatedEvent.data format");
              }
            } catch (error) {
              console.error("Failed to parse message value:", error);
            }
          }
        },
      });
      console.log(`Listening for messages on topic "${topic}"`);
    } catch (error) {
      console.error("Error in listener:", error);
    }
  }

  // Type guard to validate parsed data structure
  private isTicketCreatedEventData(data: any): data is TicketCreatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.title === "string" &&
      typeof data.price === "number"
    );
  }
}
