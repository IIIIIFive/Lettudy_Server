const chatQueries = {
  createChat: "INSERT INTO chats (id, room_id) VALUES (?, ?)",
  getChatIdByRoomId: `SELECT id FROM chats WHERE room_id = ?`,
  sendMessage: `INSERT INTO chat_items (id, chat_id, user_id, content) VALUES (?, ?, ?, ?)`,
  getChatItemsByChatId: `
    SELECT id AS chatItemId, user_id AS sender, content, created_at AS createdAt
    FROM chat_items
    WHERE chat_id = ?
    ORDER BY created_at ASC`,
  deleteMessage: `DELETE FROM chat_items WHERE id = ? AND chat_id = ? AND user_id = ?`,
  getCreatedAt: `
    SELECT created_at FROM chat_items
    WHERE chat_id = ? AND user_id = ?
    ORDER BY created_at DESC
    LIMIT 1`,
};

module.exports = chatQueries;
