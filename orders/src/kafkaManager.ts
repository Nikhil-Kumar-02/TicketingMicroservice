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

  // Setter for instance
  static setInstance(kafka: Kafka) {
    if (KafkaManager.instance) {
      throw new Error("KafkaManager instance is already initialized.");
    }
    KafkaManager.instance = new KafkaManager(kafka);
    console.log("KafkaManager instance initialized.");
  }

   // Getter for instance
  static getInstance(): KafkaManager {
    if (!KafkaManager.instance) {
      throw new Error("KafkaManager instance is not initialized. Call `setInstance` first.");
    }
    return KafkaManager.instance;
  }

  // Get a connected producer directly, ensuring it is initialized
  static getProducer(): Producer {
    const instance = KafkaManager.getInstance();
    if (!instance.isProducerConnected) {
      throw new Error("Producer is not connected. Call `connectProducer` first.");
    }
    return instance.producer;
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

  
}

export { KafkaManager };
