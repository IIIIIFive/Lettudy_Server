const memberQueries = {
  createMember:
    "INSERT INTO members (user_id, room_id, profile_num) VALUES(?, ?, ?)",
  checkMember: `
    SELECT COUNT(*) AS count
    FROM members
    WHERE members.room_id = ? AND members.user_id = ?
  `,
  getMembers: `
    SELECT members.*, users.fcm_token as fcm_token, rooms.title as room_title
    FROM members
    JOIN users
    ON users.id = members.user_id
    JOIN rooms
    ON rooms.id = members.room_id
    WHERE members.room_id = ?
  `,
  getMembersName: `
    SELECT name, profile_num
    FROM users
    JOIN members
    ON users.id = members.user_id
    WHERE members.room_id = ?
    ORDER BY name
  `,
  getMembersCount: `
    SELECT COUNT(*) as memberCount
    FROM members
    WHERE room_id = ?
  `,
  getMembersAttendanceCount: `
    SELECT users.name, members.profile_num, COUNT(attendances.id) AS count
    FROM users
    JOIN members ON users.id = members.user_id
    LEFT JOIN attendances ON users.id = attendances.user_id AND attendances.status = 1
    LEFT JOIN schedules ON schedules.id = attendances.schedule_id 
    WHERE members.room_id = ?
    GROUP BY users.id;
  `,
  getMembersProfiles: `
    SELECT profile_num
    FROM members
    WHERE room_id = ?
  `,
  deleteMember: `
    DELETE FROM members
    WHERE user_id = ? and room_id = ?
  `,
  updateAlarm: `
    UPDATE members SET alarm = ? WHERE user_id = ? AND room_id = ?
  `,
  getAlarmsOff: `
    UPDATE members SET alarm = false WHERE user_id = ?
  `,
  getAlarmInfo: `
    SELECT alarm, fcm_token as fcmToken
    FROM members
    LEFT JOIN users
    ON members.user_id = users.id
    WHERE user_id = ? AND room_id = ?
  `,
  getProfileNumByUserId: `SELECT profile_num FROM members WHERE user_id = ? AND room_id = ?`,
};

module.exports = memberQueries;
