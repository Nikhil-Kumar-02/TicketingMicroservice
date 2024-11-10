import { Kafka, Producer } from "kafkajs";
import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  producer: Producer;
  topicName:Subjects.TicketCreated = Subjects.TicketCreated;

  constructor(kafka : Kafka){
    super(kafka)
    this.producer = kafka.producer();
  }

  publishMessage = async () => {
    try {
      await this.setupTopic();          
      await this.producer.connect();
      
      const topic = this.topicName;

      const message = { 
        id : "123",
        title : "concert",
        price : 3000
      };
      
      this.sendToClient(this.topicName , message);
      console.log(`Published message to ${topic}:` , message);
    } catch (error) {
      console.error("Error in publishing:", error);
    } finally {
      await this.producer.disconnect();
    }
  }
}