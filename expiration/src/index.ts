import { Subjects } from "@nkticket/common";
import { KafkaManager } from "./kafkaManager";
import { Kafka , logLevel } from "kafkajs";

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
      { topicName: Subjects.TicketCreated, numPartitions: 3, replicationFactor: 1 },
      { topicName: Subjects.TicketUpdated, numPartitions: 3, replicationFactor: 1 },
      // Add other topics as needed
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
    process.exit(1); // Exit with error code
  }

}

start();