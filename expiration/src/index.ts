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

}

start();
