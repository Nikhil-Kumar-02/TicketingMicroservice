import { Consumer } from "kafkajs";
import { Subjects } from "./subjects";

interface Event{
  subject : Subjects;
  data : any;
}

export abstract class Listener<T extends Event>{
  abstract topicName : T["subject"];
  abstract groupName : string;
  abstract logReceivedData(data : T["data"] , topic: string,partition: number) : void;
  abstract validateMessage(data: any): data is T["data"];
  abstract consumer : Consumer;

  constructor() {}

  
  private async subscribeToTopic() {
    try {
      await this.consumer.subscribe({ topic: this.topicName, fromBeginning: true });
      console.log(`Subscribed to topic: "${this.topicName}"`);
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  }
  
  private async listenToMessages() {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const dataString = message.value?.toString();
          if (dataString) {
            try {
              const parsedData: unknown = JSON.parse(dataString);
              
              if (this.validateMessage(parsedData)) {
                this.logReceivedData(parsedData, topic, partition);
              } else {
                console.error("Invalid message format:", parsedData);
              }
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        },
      });
      
      console.log(`Listening for messages on topic "${this.topicName}"`);
    } catch (error) {
      console.error("Error in listener:", error);
    }
  }
  
  async connectToListener() {
    try {
      await this.consumer.connect();
      console.log(`Consumer connected to group "${this.groupName}"`);
      await this.subscribeToTopic();
      await this.listenToMessages();
    } catch (error) {
      console.error("Error starting listener:", error);
    }
  }

  async disconnectListener() {
    try {
      await this.consumer.disconnect();
      console.log(`Consumer disconnected from group "${this.groupName}"`);
    } catch (error) {
      console.error("Error during consumer disconnection:", error);
    }
  }

}