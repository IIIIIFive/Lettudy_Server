const memberQueries = {
  createMember:
    "INSERT INTO members (user_id, room_id, profile_num) VALUES(?, ?, ?)",
  checkMember: `
    SELECT COUNT(*) AS count
    FROM members
    WHERE members.room_id = ? AND members.user_id = ?
  `,
};

module.exports = memberQueries;
