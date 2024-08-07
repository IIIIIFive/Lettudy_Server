const memberQueries = {
  createMember:
    "INSERT INTO members (user_id, room_id, profile_num) VALUES(?, ?, ?)",
  checkMember: `
    SELECT COUNT(*) AS count
    FROM members
    WHERE members.room_id = ? AND members.user_id = ?
  `,
  getMembers: `
    SELECT * FROM members WHERE room_id = ?
  `,
  getMembersName: `
    SELECT name
    FROM users
    JOIN members
    ON users.id = members.user_id
    ORDER BY name
  `,
  getMembersAttendanceCount: `
    SELECT users.name, COUNT(attendances.id) AS count
    FROM users
    JOIN members ON users.id = members.user_id
    LEFT JOIN attendances ON users.id = attendances.user_id AND attendances.status = 1
    LEFT JOIN schedules ON schedules.id = attendances.schedule_id 
    WHERE members.room_id = ?
    GROUP BY users.id;
  `,
};

module.exports = memberQueries;
