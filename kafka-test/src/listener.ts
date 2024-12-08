import { Kafka, logLevel } from 'kafkajs';
import { TicketCreatedListener } from './events/ticket-created-listener';

const kafka = new Kafka({
  clientId: 'listener-client',
  brokers: ['localhost:9092'], 
  logLevel: logLevel.WARN,    
});

const ticketCreatedListener = new TicketCreatedListener(kafka);

async function startListeners() {
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

startListeners();