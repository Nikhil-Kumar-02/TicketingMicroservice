import { Admin, Consumer, Kafka } from "kafkajs";
import { Subjects } from "./subjects";

interface Event{
  subject : Subjects;
  data : any;
}

export abstract class Listener<T extends Event>{
  abstract topicName : T["subject"];
  abstract groupName : string;
  abstract listenToMessages : () => void;
  abstract logRecievedData(data : T["data"] , topic: string,partition: number) : void
  private client : Admin;
  abstract consumer : Consumer;

  constructor(kafka : Kafka){
    this.client = kafka.admin();
  }

  setupTopic = async () => {
    await this.client.connect();
    await this.client.createTopics({
      topics: [
        {
          topic: this.topicName,
          numPartitions: 3,         // Number of partitions
          replicationFactor: 1,     // Ensure compatibility with a single broker
        },
      ],
    });
    await this.client.disconnect();
  }

}