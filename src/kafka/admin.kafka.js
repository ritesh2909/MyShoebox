import kafka from "../config/kafkaConfig.js";

const init = async () => {
  try {
    const admin = kafka.admin();
    admin.connect();

    await admin.createTopics({
      topics: [
        {
          topic: "media",
          numPartitions: 1,
        }
      ]
    })

    await admin.disconnect();
  } catch (error) {
    console.log("Error creating topic", error)
  }
}

init();