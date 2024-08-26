const roomQueries = {
  createRoom: "INSERT INTO rooms (id, title, code) VALUES (?, ?, ?)",

  checkCode: "SELECT COUNT(*) AS count FROM rooms WHERE code = ?",

  getRoomByCode: `
    SELECT id as roomId, title, notice, code
    FROM rooms 
    WHERE code = ?
  `,

  getRoomById: `
    SELECT id as roomId, title, notice, code
    FROM rooms 
    WHERE id = ?`,

  getRooms: `
    SELECT rooms.*, members.alarm
    FROM rooms 
    JOIN members 
    ON rooms.id = members.room_id
    WHERE members.user_id = ?
    ORDER BY members.created_at DESC`,

  updateNotice: `
    UPDATE rooms
    SET notice = ?
    WHERE id = ?
  `,

  checkRoomId: `
    SELECT COUNT(*) AS count
    FROM rooms
    WHERE id = ?
  `,

  deleteRoom: `
    DELETE FROM rooms WHERE id = ?
  `,
};

module.exports = roomQueries;
