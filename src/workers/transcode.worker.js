import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import AWS from 'aws-sdk';
import { config } from 'dotenv';


config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const elastictranscoder = new AWS.ElasticTranscoder();


// Create a Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379, 
  maxRetriesPerRequest: null
});


// Worker for processing transcode jobs
const transcodeWorker = new Worker('transcodeQueue', async (job) => {
  const { inputKey, bucket } = job.data;

  const params = {
    PipelineId: '1726397099397-9tlbtw',
    Input: {
      Key: inputKey,
    },
    Outputs: [
      {
        Key: `transcoded/${Date.now()}_720p.mp4`,
        PresetId: '1351620000001-000010', // System preset: Generic 720p
      },
      {
        Key: `transcoded/${Date.now()}_480p.mp4`,
        PresetId: '1351620000001-000020', // System preset: Generic 480p
      },
      {
        Key: `transcoded/${Date.now()}_360p.mp4`,
        PresetId: '1351620000001-000040', // System preset: Generic 360p
      },
    ],
    OutputKeyPrefix: 'transcoded/',
  };

  try {
    await elastictranscoder.createJob(params).promise();
    console.log('Transcoding job started for:', inputKey);
  } catch (err) {
    console.error('Error during transcoding:', err);
    throw err;
  }
}, { connection }); // Pass the Redis connection here

transcodeWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

transcodeWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});
