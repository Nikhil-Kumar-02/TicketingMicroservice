import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'publisher-client',
  brokers: ['localhost:9092'], // Port-forwarded address
  logLevel: logLevel.WARN,     // Optional to reduce verbosity
});

const admin = kafka.admin();
const producer = kafka.producer();

const setupTopic = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: 'test-topic',
        numPartitions: 3,         // Number of partitions (adjust as needed)
        replicationFactor: 1,     // Ensure compatibility with a single broker
      },
    ],
  });
  await admin.disconnect();
};

const publishMessage = async () => {
  try {
    await setupTopic();           // Ensures topic is set up correctly
    await producer.connect();
    
    const topic = 'test-topic';
    const message = { value: `Hello from publisher at ${new Date().toISOString()}` };
    
    await producer.send({
      topic,
      messages: [message],
    });
    console.log(`Published message to ${topic}: ${message.value}`);
  } catch (error) {
    console.error("Error in publishing:", error);
  } finally {
    await producer.disconnect();
  }
};

publishMessage();
