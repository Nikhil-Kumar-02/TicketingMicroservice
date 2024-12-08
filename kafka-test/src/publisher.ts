import { Kafka, logLevel } from 'kafkajs';
import { KafkaManager } from './kafkaManager';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { Subjects } from './events/subjects';

const kafka = new Kafka({
  clientId: 'publisher-client',
  brokers: ['localhost:9092'], // Port-forwarded address
  logLevel: logLevel.WARN,     // Optional to reduce verbosity
});


const start = async () => {
  // Initialize KafkaManager and producers
  const kafkaManager = KafkaManager.getInstance(kafka);
  
  await kafkaManager.connectProducer();

   // Setup topics
   await kafkaManager.setupTopics([
      { topicName: Subjects.TicketCreated, numPartitions: 3, replicationFactor: 1 },
      // Add other topics if needed
    ]);

  // Publish a message to the "ticket-created" topic
  const ticketPublisher = new TicketCreatedPublisher(kafkaManager.getProducer())
  await ticketPublisher.publishMessage({ id: "1", title: "Concert", price: 100 });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await kafkaManager.disconnectProducer();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Shutting down gracefully...");
    await kafkaManager.disconnectProducer();
    process.exit(0);
  });

}

start();