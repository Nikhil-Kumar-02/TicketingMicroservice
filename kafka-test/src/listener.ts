import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'listener-client',
  brokers: ['localhost:9092'], // Port-forwarded address
  logLevel: logLevel.WARN,     // Optional to reduce verbosity
});

const admin = kafka.admin();
const consumer = kafka.consumer({ groupId: 'test-group' });

const setupTopic = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: 'test-topic',
        numPartitions: 3,         // Number of partitions
        replicationFactor: 1,     // Ensure compatibility with a single broker
      },
    ],
  });
  await admin.disconnect();
};

const listenToMessages = async () => {
  try {
    await setupTopic();           // Ensures topic is set up correctly
    await consumer.connect();
    
    const topic = 'test-topic';
    await consumer.subscribe({ topic, fromBeginning: true });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
      },
    });
    console.log(`Listening for messages on topic "${topic}"`);
  } catch (error) {
    console.error("Error in listener:", error);
  }
};

listenToMessages();
