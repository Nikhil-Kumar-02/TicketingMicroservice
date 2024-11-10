import { Kafka, logLevel } from 'kafkajs';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const kafka = new Kafka({
  clientId: 'publisher-client',
  brokers: ['localhost:9092'], // Port-forwarded address
  logLevel: logLevel.WARN,     // Optional to reduce verbosity
});

new TicketCreatedPublisher(kafka).publishMessage({ 
  id : "123",
  title : "concert",
  price : 3000
});
