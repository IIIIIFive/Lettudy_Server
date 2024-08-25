const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
} = require("../settings");

const s3 = new S3Client({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  Bucket: AWS_S3_BUCKET_NAME,
  region: AWS_REGION,
});

const getPreSignedUrl = async (fileName) => {
  try {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: "image/*",
    };

    const preSignedUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
      expiresIn: 60 * 30,
    });

    return preSignedUrl;
  } catch (err) {
    throw err;
  }
};

//Objects: [{Key: "파일명"}, ...]
const deleteObject = async (Objects) => {
  try {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: {
        Objects,
      },
    };

    const command = new DeleteObjectsCommand(params);
    await s3.send(command);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getPreSignedUrl,
  deleteObject,
};
