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
};
