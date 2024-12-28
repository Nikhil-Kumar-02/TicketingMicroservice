export const KafkaManager = {
  getProducer: jest.fn(() => ({
    send: jest.fn(async () => {
      console.log("Mock send method invoked");
    }), // Mock implementation for the send method
  })),
};
