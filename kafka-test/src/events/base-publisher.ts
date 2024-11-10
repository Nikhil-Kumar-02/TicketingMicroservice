import { Admin, Kafka, Producer } from "kafkajs";
import { Subjects } from "./subjects";

interface Event{
  subject : Subjects;
  data : any
}

export abstract class Publisher<T extends Event>{
  private client : Admin;
  abstract producer :Producer;
  abstract topicName : T["subject"];
  abstract publishMessage : () => void
  
  constructor(kafka:Kafka){
    this.client = kafka.admin();
  }
  
  sendToClient = async (topic:T["subject"] , message:T["data"]) => {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  setupTopic = async () => {
    await this.client.connect();
    await this.client.createTopics({
      topics: [
        {
          topic: this.topicName,
          numPartitions: 3,         // Number of partitions (adjust as needed)
          replicationFactor: 1,     // Ensure compatibility with a single broker
        },
      ],
    });
    await this.client.disconnect();
  };
} 