import kafka from "../config/kafkaConfig.js";

export const sendMessage = async (message) => {
  try {
    const producer = kafka.producer();
    await producer.connect();

    for(let i = 0;i<10;i++) {
      await producer.send({
        topic: "media",
        messages: [{ value: message + i }],
      });
    }

    producer.disconnect();
    console.log("Message sent to Kafka");
  } catch (error) {
    console.log("Error sending message to Kafka", error);
  }
};
