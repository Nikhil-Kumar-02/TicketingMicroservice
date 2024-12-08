import { Producer } from "kafkajs";
import { Subjects } from "./subjects";

interface Event{
  subject : Subjects;
  data : any
}

export abstract class Publisher<T extends Event>{
  private producer: Producer;
  abstract topicName : T["subject"];  
  
  constructor(producer: Producer) {
    this.producer = producer;
  }

  async publishMessage(message: T["data"]) {
    try {
      await this.producer.send({
        topic: this.topicName, // Uses the subject defined in the subclass
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log(`Message published to ${this.topicName}:`, message);
    } catch (error) {
      console.error(`Error publishing to ${this.topicName}:`, error);
    }
  }

} 