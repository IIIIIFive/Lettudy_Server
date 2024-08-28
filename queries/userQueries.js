const userQueries = {
  createUser: `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,

  getUserById: `SELECT * FROM users WHERE id = ?`,

  getUserByEmail: `SELECT * FROM users WHERE email = ?`,

  getNameById: `SELECT name FROM users WHERE id = ?`,

  deleteUser: `DELETE FROM users WHERE id = ?`,

  checkEmail: `SELECT COUNT(*) as count FROM users WHERE email = ?`,

  updateFcmToken: `UPDATE users SET fcm_token = ? WHERE id = ?`,

  deleteFcmToken: `UPDATE users SET fcm_token = NULL WHERE id = ?`,

  deleteFcmTokenByToken: `UPDATE users SET fcm_token = NULL WHERE fcm_token = ?`,
};

module.exports = userQueries;
