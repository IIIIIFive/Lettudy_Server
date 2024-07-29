const userQueries = {
  createUser: `INSERT INTO users (id, name, email, password, salt) VALUES (?, ?, ?, ?, ?)`,
  getUserByEmail: `SELECT * FROM users WHERE email = ?`,
  deleteUser: `DELETE FROM users WHERE id = ?`,
  checkEmail: `SELECT COUNT(*) as count FROM users WHERE email = ?`,
  updatePassword: `UPDATE users SET password = ?, salt = ? WHERE id = ?`,
};

module.exports = userQueries;
