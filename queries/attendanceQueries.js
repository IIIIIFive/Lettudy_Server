const attendanceQueries = {
  createAttendances: `
    INSERT 
    INTO attendances (id, schedule_id, user_id, status)
    VALUES ?
    `,
  deleteAttendances: `
    DELETE FROM attendances WHERE schedule_id = ?
  `,
  updateAttendanceStatus: `
    UPDATE attendances
    SET status = 1
    WHERE id = ? AND user_id = ?
  `,
  getUserAttendances: `
    SELECT status, date
    FROM attendances
    JOIN schedules
    ON schedules.id = attendances.schedule_id
    WHERE attendances.user_id = ? AND schedules.room_id = ? AND schedules.date < NOW()
    ORDER BY date DESC
  `,
  deleteMemberAttendances: `
    DELETE FROM attendances
    WHERE user_id = ? AND schedule_id IN (SELECT id FROM schedules WHERE room_id = ?)
  `,
  getAttendanceId: `
    SELECT id
    FROM attendances
    WHERE user_id = ? AND schedule_id = ?
  `,
  getAttendancesByRoom: `
    SELECT attendances.id as attendanceId, schedules.id as scheduleId, title, date
    FROM attendances
    LEFT JOIN schedules
    ON schedules.id = attendances.schedule_id
    WHERE user_id = ? AND room_id = ? AND date > NOW()
  `,
};

module.exports = attendanceQueries;
