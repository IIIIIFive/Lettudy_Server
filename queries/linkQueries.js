const linkQueries = {
  createLink: `INSERT INTO links (id, room_id, title, url) VALUES (?,?,?,?)`,

  getLinks: `SELECT * FROM links WHERE room_id =? ORDER BY created_at DESC`,

  deleteLink: `DELETE FROM links WHERE id =?`,

  getLinkById: `SELECT room_id FROM links WHERE id = ?`,
};

module.exports = linkQueries;
