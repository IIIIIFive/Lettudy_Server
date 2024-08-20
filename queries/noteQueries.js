const noteQueries = {
  createNote: `
    INSERT INTO notes (id, room_id, title, content) VALUES (?, ?, ?, ?)
  `,
  createNoteImages: `
    INSERT INTO note_images (id, note_id, name) values ?
  `,
  getNotes: `
    SELECT id AS noteId, title, created_at as createdAt
    FROM notes
    WHERE room_id = ?
    ORDER BY notes.created_at DESC
  `,
  getNote: `
    SELECT * FROM notes where id = ?;
  `,
  getNoteImages: `
    SELECT * FROM note_images where note_id = ?
  `,
  updateNote: `
    UPDATE notes
    SET title = ?, content = ?
    WHERE id = ?
  `,
  deleteNote: `
    DELETE FROM notes WHERE id = ?
  `,
  deleteNoteImage: `
    DELETE FROM note_images WHERE id =?
  `,
  deleteNoteImagesByNote: `
    DELETE FROM note_images WHERE note_id =?
  `,
};

module.exports = noteQueries;
