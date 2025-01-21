import kafka from "../config/kafkaConfig.js";

const consumer = kafka.consumer({ groupId: "myshoebox-media-group" });

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Consumer connected to Kafka");

    await consumer.subscribe({ topic: "test", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(), // Ensure you convert the buffer to a string
        });
      },
    });
  } catch (error) {
    console.error("Error running Kafka consumer", error);
  }
};

export default runConsumer;
