const roomQueries = {
  createRoom:
    "INSERT INTO rooms (id, owner_id, title, code) VALUES (?, ?, ?, ?)",
  updateRoomMemberCount: `
    UPDATE rooms
    SET member_count = member_count + 1
    WHERE id = ?
  `,
  createMember:
    "INSERT INTO members (id, user_id, room_id, profile_num) VALUES(?, ?, ?, ?)",
  checkCode: "SELECT COUNT(*) AS count FROM rooms WHERE code = ?",
  getIdByCode: "SELECT id FROM rooms WHERE code = ?",
  getRoomById: `
    SELECT rooms.id as roomId, title, notice, member_count, rooms.created_at, owner_id, name as owner
    FROM rooms 
    LEFT JOIN users 
    ON users.id = rooms.owner_id 
    WHERE rooms.id = ?`,
  checkMember: `
    SELECT id, COUNT(*) AS count
    FROM members
    WHERE members.room_id = ? AND members.user_id = ?
  `,
  getRooms: `
    SELECT rooms.*, members.id as member_id, members.profile_num, members.alarm, members.created_at as joined_at
    FROM rooms 
    LEFT JOIN members 
    ON rooms.id = members.room_id
    WHERE members.user_id = ?
    ORDER BY members.created_at DESC`,
  updateNotice: `
    UPDATE rooms
    SET notice = ?
    WHERE id = ?
  `,
};

module.exports = roomQueries;
