const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadImageToS3 = (file) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(file.originalname);
    const key = `${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

module.exports = {
  uploadImageToS3,
};
