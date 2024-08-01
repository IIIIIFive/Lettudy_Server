const crypto = require("crypto");

const hashPassword = (password, salt, length = 50) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve(derivedKey.toString("hex").slice(0, length));
    });
  });
};

const generateSalt = (length = 16) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString("hex"));
    });
  });
};

const createCode = () => {
  return crypto.randomBytes(5).toString("hex");
};

module.exports = {
  hashPassword,
  generateSalt,
  createCode,
};
