import { Admin, Consumer, Kafka } from "kafkajs";

export abstract class Listener{
  abstract topicName : string;
  abstract groupName : string;
  abstract listenToMessages : () => void;
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