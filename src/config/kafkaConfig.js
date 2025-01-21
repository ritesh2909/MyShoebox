import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'myshoebox-media',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
})

export default kafka;
