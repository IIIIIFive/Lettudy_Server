const chatQueries = {
  createChat: "INSERT INTO chats (id, room_id) VALUES (?, ?)",

  getChatIdByRoomId: `SELECT id FROM chats WHERE room_id = ?`,

  sendMessage: `INSERT INTO chat_items (id, chat_id, user_id, content) VALUES (?, ?, ?, ?)`,

  getChatItemsByChatId: `
    SELECT id AS chatItemId, user_id AS sender, content, created_at AS createdAt
    FROM chat_items
    WHERE chat_id = ?
    ORDER BY created_at ASC`,
};

module.exports = chatQueries;
