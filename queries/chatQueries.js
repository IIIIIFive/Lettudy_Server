const chatQueries = {
  createChat: "INSERT INTO chats (id, room_id) VALUES (?, ?)",
  getChatIdByRoomId: `SELECT id FROM chats WHERE room_id = ?`,
  sendMessage: `INSERT INTO chat_items (id, chat_id, user_id, content) VALUES (?, ?, ?, ?)`,
  getChatsByRoomId: `
    SELECT ci.id AS chatItemId, ci.user_id AS userId, ci.content, ci.image_url AS imageUrl, ci.created_at AS createdAt
    FROM chat_items ci
    JOIN chats c ON ci.chat_id = c.id
    WHERE c.room_id = ?
    ORDER BY ci.created_at ASC`,
  getChatItemsByChatId: `
    SELECT id AS chatItemId, user_id AS sender, content, created_at AS createdAt, image_url AS imageUrl
    FROM chat_items
    WHERE chat_id = ?
    ORDER BY created_at ASC`,
  deleteMessage: `DELETE FROM chat_items WHERE id = ? AND chat_id = ? AND user_id = ?`,
};

module.exports = chatQueries;
