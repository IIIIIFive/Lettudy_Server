const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const conn = require("../utils/db");
const userQueries = require("../queries/userQueries");

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
