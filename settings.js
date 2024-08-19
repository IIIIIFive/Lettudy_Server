require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const FCM_TYPE = process.env.FCM_TYPE;
const FCM_PROJECT_ID = process.env.FCM_PROJECT_ID;
const FCM_PRIVATE_KEY_ID = process.env.FCM_PRIVATE_KEY_ID;
const FCM_PRIVATE_KEY = process.env.FCM_PRIVATE_KEY;
const FCM_CLIENT_EMAIL = process.env.FCM_CLIENT_EMAIL;
const FCM_CLIENT_ID = process.env.FCM_CLIENT_ID;
const FCM_AUTH_URI = process.env.FCM_AUTH_URI;
const FCM_TOKEN_URI = process.env.FCM_TOKEN_URI;
const FCM_AUTH_PROVIDER_X509_CERT_URL =
  process.env.FCM_AUTH_PROVIDER_X509_CERT_URL;
const FCM_CLIENT_X509_CERT_URL = process.env.FCM_CLIENT_X509_CERT_URL;
const FCM_UNIVERSE_DOMAIN = process.env.FCM_UNIVERSE_DOMAIN;

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

module.exports = {
  JWT_SECRET,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  FCM_TYPE,
  FCM_PROJECT_ID,
  FCM_PRIVATE_KEY_ID,
  FCM_PRIVATE_KEY,
  FCM_CLIENT_EMAIL,
  FCM_CLIENT_ID,
  FCM_AUTH_URI,
  FCM_TOKEN_URI,
  FCM_AUTH_PROVIDER_X509_CERT_URL,
  FCM_CLIENT_X509_CERT_URL,
  FCM_UNIVERSE_DOMAIN,
  AWS_S3_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID,
};
