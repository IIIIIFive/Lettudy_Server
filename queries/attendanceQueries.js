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
    WHERE attendances.user_id = ? AND schedules.room_id = ? AND schedules.date < NOW() OR attendances.status = 1
    ORDER BY date DESC
  `,
};

module.exports = attendanceQueries;
