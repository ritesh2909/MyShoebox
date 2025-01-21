import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'myshoebox',
  brokers: ['localhost:9092'],
});

export default kafka;
