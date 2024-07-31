const roomQueries = {
  createRoom:
    "INSERT INTO rooms (id, owner_id, title, code) VALUES (?, ?, ?, ?)",
  updateRoom: `
    UPDATE rooms
    SET member_count = member_count + 1
    WHERE code = ?
  `,
  createMember: "INSERT INTO members (id, user_id, room_id) VALUES(?, ?, ?)",
  checkCode: "SELECT COUNT(*) AS count FROM rooms WHERE code = ?",
  getRoomByCode: `
    SELECT rooms.id as id, title, code, notice, member_count, owner_id, name as owner
    FROM rooms 
    LEFT JOIN users 
    ON users.id = rooms.owner_id 
    WHERE code = ?`,
  checkMember: `
    SELECT COUNT(*) AS count
    FROM members
    LEFT JOIN rooms ON members.room_id = rooms.id
    WHERE members.user_id = ? AND rooms.code = ?
  `,
  getRooms: `
    SELECT * 
    FROM rooms 
    LEFT JOIN members 
    ON rooms.id = members.room_id
    WHERE members.user_id = ?`,
};

module.exports = roomQueries;
