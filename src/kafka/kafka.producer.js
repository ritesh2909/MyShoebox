import kafka from "../config/kafkaConfig.js";

const producer = kafka.producer();

export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Producer connected to Kafka");
  } catch (error) {
    console.log("Error connecting producer to Kafka", error);
  }
};

export const sendMessage = async (message) => {
  try {
    await producer.send({
      topic: "test",
      messages: [{ value: message }],
    });
    console.log("Message sent to Kafka");
  } catch (error) {
    console.log("Error sending message to Kafka", error);
  }
};
