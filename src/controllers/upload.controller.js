import AWS from 'aws-sdk';
import BullMQ, { tryCatch } from "bullmq";
import { sendMessage } from '../kafka/kafka.producer.js';

export const initializeUpload = async (req, res) => {
  try {
    const { filename } = req.body;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const bucketName = process.env.AWS_BUCKET_NAME;


    const createParams = {
      Bucket: bucketName,
      Key: filename,
      ContentType: 'video/mp4'
    };

    const multipartParams = await s3.createMultipartUpload(createParams).promise();
    console.log("multipartparams---- ", multipartParams);
    const uploadId = multipartParams.UploadId;

    res.status(200).json({ uploadId });

  } catch (error) {
    console.log("Error initializing the upload", error)
    return res.status(500).json("Error initializing upload")
  }
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// const transcodeQueue = new BullMQ.Queue('transcodeQueue');

export const handleFileUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.file;
  const key = `${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  // await transcodeQueue.add('transcode', {
  //   inputKey: params.Key,
  //   bucket: process.env.AWS_S3_BUCKET_NAME,
  // });

  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Error uplaoding file")
  }
};

export const sendMessageFromClient = async(req, res) =>{
  try {
    const message = req.body.message;
    sendMessage(message);
    return res.status(200).json("Message sent!");
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

