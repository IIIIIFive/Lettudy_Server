const chatQueries = {
  createChat: "INSERT INTO chats (id, room_id) VALUES (?, ?)",
};

module.exports = chatQueries;
