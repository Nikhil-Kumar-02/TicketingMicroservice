import { Admin, Kafka, Producer } from "kafkajs";
import { Subjects } from "./subjects";

interface Event{
  subject : Subjects;
  data : any
}

export abstract class Publisher<T extends Event>{
  private client : Admin;
  private producer :Producer;
  abstract topicName : T["subject"];  
  
  constructor(kafka:Kafka){
    this.client = kafka.admin();
    this.producer = kafka.producer();
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
  }

  publishMessage = async (message:T["data"]) => {
    try {
      await this.setupTopic();          
      await this.producer.connect();
      
      const topic = this.topicName;

      this.sendToClient(this.topicName , message);
      console.log(`Published message to ${topic}:` , message);
    } catch (error) {
      console.error("Error in publishing:", error);
    } finally {
      await this.producer.disconnect();
    }
  }
} 