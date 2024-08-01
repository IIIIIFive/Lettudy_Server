const roomQueries = {
  createRoom: "INSERT INTO rooms (id, owner_id, title) VALUES (?, ?, ?)",
  updateRoomMemberCount: `
    UPDATE rooms
    SET member_count = member_count + 1
    WHERE id = ?
  `,
  createMember: "INSERT INTO members (id, user_id, room_id) VALUES(?, ?, ?)",
  checkId: "SELECT COUNT(*) AS count FROM rooms WHERE id = ?",
  getRoomById: `
    SELECT rooms.id as id, title, notice, member_count, owner_id, name as owner
    FROM rooms 
    LEFT JOIN users 
    ON users.id = rooms.owner_id 
    WHERE rooms.id = ?`,
  checkMember: `
    SELECT COUNT(*) AS count
    FROM members
    WHERE members.room_id = ? AND members.user_id = ?
  `,
  getRooms: `
    SELECT rooms.* 
    FROM rooms 
    LEFT JOIN members 
    ON rooms.id = members.room_id
    WHERE members.user_id = ?`,
};

module.exports = roomQueries;
