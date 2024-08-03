const bcrypt = require("bcrypt");
const crypto = require("crypto");

const hashPassword = async (password, saltRounds = 10) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createCode = () => {
  return crypto.randomBytes(3).toString("hex");
};

module.exports = {
  hashPassword,
  comparePassword,
  createCode,
};
