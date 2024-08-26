const admin = require("firebase-admin");
const conn = require("../utils/db");
const userQueries = require("../queries/userQueries");
const settings = require("../settings");

const serviceAccount = {
  type: settings.FCM_TYPE,
  project_id: settings.FCM_PROJECT_ID,
  private_key_id: settings.FCM_PRIVATE_KEY_ID,
  private_key: settings.FCM_PRIVATE_KEY.replace(/\/n/g, "\n"),
  client_email: settings.FCM_CLIENT_EMAIL,
  client_id: settings.FCM_CLIENT_ID,
  auth_uri: settings.FCM_AUTH_URI,
  token_uri: settings.FCM_TOKEN_URI,
  auth_provider_x509_cert_url: settings.FCM_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: settings.FCM_CLIENT_X509_CERT_URL,
  universe_domain: settings.FCM_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(response);
  } catch (error) {
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      await conn.query(userQueries.deleteFcmTokenByToken, token);
    }
  }
};

module.exports = { sendPushNotification };
