const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
} = require("../settings");

const s3 = new S3({
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

const deleteObject = async (fileName) => {};

module.exports = {
  getPreSignedUrl,
  deleteObject,
};
