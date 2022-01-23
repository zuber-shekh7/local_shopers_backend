import S3 from "aws-sdk/clients/s3.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFile = (file, upload_to) => {
  const extension = path.extname(file.originalname);
  const timestamp = new Date().getTime();
  const fileName = upload_to
    ? upload_to + timestamp + extension
    : timestamp + extension;

  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: fileName,
  };

  return s3.upload(uploadParams).promise();
};

export { uploadFile };
