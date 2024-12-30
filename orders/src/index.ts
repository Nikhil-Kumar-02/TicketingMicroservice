import mongoose from "mongoose";
import { app } from "./app";
import { KafkaManager } from "./kafkaManager";
import { Subjects } from "@nkticket/common";
import { Kafka , logLevel } from "kafkajs";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  if(!process.env.MONGO_URI){
    throw new Error("MONGO URI must be defined")
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

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
      { topicName: Subjects.OrderCreated, numPartitions: 3, replicationFactor: 1 },
      { topicName: Subjects.OrderCancelled, numPartitions: 3, replicationFactor: 1 },
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

  const ticketCreatedListener = new TicketCreatedListener(kafka);
  const ticketUpdatedListener = new TicketUpdatedListener(kafka);
  const expirationCompleteListener = new ExpirationCompleteListener(kafka);
  const paymentCreatedListener = new PaymentCreatedListener(kafka);

  async function startCreatedtListeners() {
    try {
      await ticketCreatedListener.connectToListener();

      // Graceful shutdown handling
      const gracefulShutdown = async () => {
        console.log("Shutting down gracefully...");
        await ticketCreatedListener.disconnectListener();
        process.exit(0);
      };

      process.on("SIGINT", gracefulShutdown);
      process.on("SIGTERM", gracefulShutdown);
      
    } catch (error) {
      console.error("Error starting listeners:", error);
    }
  }

  async function startUpdatedListeners() {
    try {
      await ticketUpdatedListener.connectToListener();

      // Graceful shutdown handling
      const gracefulShutdown = async () => {
        console.log("Shutting down gracefully...");
        await ticketUpdatedListener.disconnectListener();
        process.exit(0);
      };

      process.on("SIGINT", gracefulShutdown);
      process.on("SIGTERM", gracefulShutdown);
      
    } catch (error) {
      console.error("Error starting listeners:", error);
    }
  }

  async function startExpirationCompleteListener() {
    try {
      await expirationCompleteListener.connectToListener();

      // Graceful shutdown handling
      const gracefulShutdown = async () => {
        console.log("Shutting down gracefully...");
        await expirationCompleteListener.disconnectListener();
        process.exit(0);
      };

      process.on("SIGINT", gracefulShutdown);
      process.on("SIGTERM", gracefulShutdown);
      
    } catch (error) {
      console.error("Error starting listeners:", error);
    }
  }

  async function startPaymentCreatedListener() {
    try {
      await paymentCreatedListener.connectToListener();

      // Graceful shutdown handling
      const gracefulShutdown = async () => {
        console.log("Shutting down gracefully...");
        await paymentCreatedListener.disconnectListener();
        process.exit(0);
      };

      process.on("SIGINT", gracefulShutdown);
      process.on("SIGTERM", gracefulShutdown);
      
    } catch (error) {
      console.error("Error starting listeners:", error);
    }
  }

  await startCreatedtListeners();
  await startUpdatedListeners();
  await startExpirationCompleteListener();
  await startPaymentCreatedListener();

  app.listen(3000 , () => {
    console.log("running orders on port 3000 !!!");
  })

}

start();