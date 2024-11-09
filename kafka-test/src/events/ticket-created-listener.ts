import { Consumer, Kafka } from "kafkajs";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener{
  consumer: Consumer;
  topicName = 'test-topic';
  groupName = 'test-group';

  constructor(kafka : Kafka){
    super(kafka);
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  listenToMessages = async () => {
    try {
      await this.setupTopic();           // Ensures topic is set up correctly
      await this.consumer.connect();
      
      const topic = this.topicName;
      await this.consumer.subscribe({ topic, fromBeginning: true });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            topic,
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          });
        },
      });
      console.log(`Listening for messages on topic "${topic}"`);
    } catch (error) {
      console.error("Error in listener:", error);
    }
  }

}