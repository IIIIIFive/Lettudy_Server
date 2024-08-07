const scheduleQueries = {
  createSchedule: `INSERT INTO schedules (id, room_id, title, date, is_attendance) VALUES (?,?,?,?,?)`,
  deleteSchedule: `DELETE FROM schedules WHERE id = ?`,
  getSchedule: `SELECT * FROM schedules WHERE id = ?`,
  getSchedulesByRoomId: `SELECT * FROM schedules WHERE room_id = ?`,
  getAttendanceDate: `
    SELECT attendances.id as attendanceId, title, date
    FROM attendances
    JOIN schedules
    ON attendances.schedule_id = schedules.id
    WHERE schedules.room_id = ? AND addtime(schedules.date, "0:20:0") > NOW() AND attendances.user_id = ?
    ORDER BY date ASC LIMIT 1
  `,
  getTotalAttendances: `
    SELECT COUNT(*) AS totalCount
    FROM schedules
    WHERE room_id = ? AND is_attendance=1
  `,
};

module.exports = scheduleQueries;
