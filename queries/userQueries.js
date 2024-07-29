const userQueries = {
  createUser: `INSERT INTO users (id, name, email, password, salt) VALUES (?, ?, ?, ?, ?)`,
  getUserByEmail: `SELECT * FROM users WHERE email = ?`,
};

module.exports = userQueries;
