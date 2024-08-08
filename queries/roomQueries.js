const roomQueries = {
  createRoom:
    "INSERT INTO rooms (id, owner_id, title, code, member_count) VALUES (?, ?, ?, ?, ?)",
  increaseRoomMemberCount: `
    UPDATE rooms
    SET member_count = member_count + 1
    WHERE id = ?
  `,
  decreaseRoomMembercount: `
    UPDATE rooms
    SET member_count = member_count - 1
    WHERE id = ?
  `,
  checkCode: "SELECT COUNT(*) AS count FROM rooms WHERE code = ?",
  getIdByCode: "SELECT id FROM rooms WHERE code = ?",
  getRoomById: `
    SELECT rooms.id as roomId, title, notice, member_count, rooms.created_at, owner_id, name as owner
    FROM rooms 
    JOIN users 
    ON users.id = rooms.owner_id 
    WHERE rooms.id = ?`,
  getRooms: `
    SELECT rooms.*, members.profile_num, members.alarm, members.created_at as joined_at
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
};

module.exports = roomQueries;
