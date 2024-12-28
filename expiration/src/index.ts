import { Kafka , logLevel } from "kafkajs";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { KafkaManager } from "./kafkaManager";
import { Subjects } from "@nkticket/common";

const start = async () => {
  if(!process.env.KAFKA_BROKER_ID){
    throw new Error("KAFKA_BROKER_ID must be defined")
  }
  if(!process.env.KAFKA_CLIENT_ID){
    throw new Error("KAFKA_CLIENT_ID must be defined")
  }
  
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER_ID], 
    logLevel: logLevel.WARN,
  });

  try {
    KafkaManager.setInstance(kafka);

    const kafkaManager = KafkaManager.getInstance();
    await kafkaManager.connectProducer();

    await kafkaManager.setupTopics([
      { topicName: Subjects.ExpirationComplete, numPartitions: 3, replicationFactor: 1 },
    ]);

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      await kafkaManager.disconnectProducer();
      process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    console.error("Error during Kafka initialization or message publishing:", error);
    process.exit(1);
  }

  const orderCreatedListener = new OrderCreatedListener(kafka);

  async function startCreatedtListeners() {
    try {
      await orderCreatedListener.connectToListener();

      // Graceful shutdown handling
      const gracefulShutdown = async () => {
        console.log("Shutting down gracefully...");
        await orderCreatedListener.disconnectListener();
        process.exit(0);
      };

      process.on("SIGINT", gracefulShutdown);
      process.on("SIGTERM", gracefulShutdown);
      
    } catch (error) {
      console.error("Error starting listeners:", error);
    }
  }

  startCreatedtListeners();

}

start();
