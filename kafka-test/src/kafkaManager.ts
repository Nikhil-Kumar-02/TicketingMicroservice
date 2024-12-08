import { Kafka, Producer, Admin } from "kafkajs";

interface TopicConfig {
  topicName: string;
  numPartitions: number;
  replicationFactor: number;
}

class KafkaManager {
  private static instance: KafkaManager;
  private producer: Producer;
  private admin: Admin;
  private isProducerConnected: boolean = false;

  private constructor(private kafka: Kafka) {
    this.producer = kafka.producer();
    this.admin = kafka.admin();
  }

  // Singleton instance
  static getInstance(kafka: Kafka): KafkaManager {
    if (!KafkaManager.instance) {
      KafkaManager.instance = new KafkaManager(kafka);
    }
    return KafkaManager.instance;
  }

  // Connect the producer
  async connectProducer() {
    if (this.isProducerConnected) {
      console.log("Producer already connected.");
      return;
    }

    await this.producer.connect();
    this.isProducerConnected = true;
    console.log("Kafka producer connected.");
  }

  // Disconnect the producer
  async disconnectProducer() {
    if (!this.isProducerConnected) {
      console.log("Producer is not connected.");
      return;
    }

    await this.producer.disconnect();
    this.isProducerConnected = false;
    console.log("Kafka producer disconnected.");
  }

  // Setup topics
  async setupTopics(topicConfigs: TopicConfig[]) {
    await this.admin.connect();
    const existingTopics = (await this.admin.listTopics()) || [];
    const topicsToCreate = topicConfigs.filter(
      (topic) => !existingTopics.includes(topic.topicName)
    );

    if (topicsToCreate.length > 0) {
      await this.admin.createTopics({
        topics: topicsToCreate.map(({ topicName, numPartitions, replicationFactor }) => ({
          topic: topicName,
          numPartitions,
          replicationFactor,
        })),
      });
      console.log(`Topics created: ${topicsToCreate.map((t) => t.topicName).join(", ")}`);
    } else {
      console.log("No new topics to create.");
    }

    await this.admin.disconnect();
  }

  // Get the connected producer
  getProducer(): Producer {
    if (!this.isProducerConnected) {
      throw new Error("Producer is not connected. Call `connectProducer` first.");
    }
    return this.producer;
  }
}

export { KafkaManager };
