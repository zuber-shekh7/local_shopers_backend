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

const uploadFile = (file, uploadTo) => {
  const extension = path.extname(file.name);
  const timestamp = new Date().getTime();
  const fileName = uploadTo
    ? `${uploadTo}/${timestamp}${extension}`
    : `${timestamp}${extension}`;

  const uploadParams = {
    Bucket: bucketName,
    Body: file.data,
    Key: fileName,
  };

  return s3.upload(uploadParams).promise();
};

export { uploadFile };
