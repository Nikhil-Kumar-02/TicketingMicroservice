import { Kafka, logLevel } from 'kafkajs';
import { TicketCreatedListener } from './events/ticket-created-listener';

const kafka = new Kafka({
  clientId: 'listener-client',
  brokers: ['localhost:9092'], 
  logLevel: logLevel.WARN,    
});

new TicketCreatedListener(kafka).listenToMessages();
