const scheduleQueries = {
  createSchedule: `INSERT INTO schedules (id, room_id, title, date, is_attendance) VALUES (?,?,?,?,?)`,
  deleteSchedule: `DELETE FROM schedules WHERE id = ?`,
  getSchedule: `SELECT * FROM schedules WHERE id = ?`,
  getMemberByUserIdRoomId: `SELECT * FROM members WHERE user_id = ? AND room_id = ?`,
};

module.exports = scheduleQueries;
