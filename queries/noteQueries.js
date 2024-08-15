const noteQueries = {
  createNote: `
    INSERT INTO notes (id, room_id, title, content) VALUES (?, ?, ?, ?)
  `,
  getNotesFilteredByTags: `
    SELECT notes.id AS noteId, title, content, created_at AS createdAt
    FROM notes
    LEFT JOIN tags
    ON tags.note_id = notes.id
    WHERE notes.room_id = ? AND tags.name IN ?
    GROUP BY notes.id
    ORDER BY notes.created_at DESC
    LIMIT ? OFFSET ?
  `,
  getCountFilteredByTags: `
    SELECT COUNT(DISTINCT notes.id) AS totalCount
    FROM notes
    LEFT JOIN tags
    ON tags.note_id = notes.id
    WHERE notes.room_id = ? AND tags.name IN ?
  `,
  getNotes: `
    SELECT id AS noteId, title, content, created_at as createdAt
    FROM notes
    WHERE room_id = ?
    ORDER BY notes.created_at DESC
    LIMIT ? OFFSET ?
  `,
  getCount: `
    SELECT COUNT(*) AS totalCount FROM notes WHERE room_id = ?
  `,
  getNote: `
    SELECT * FROM notes where id = ?;
  `,
  updateNote: `
    UPDATE notes
    SET title = ?, content = ?
    WHERE id = ?
  `,
  deleteNote: `
    DELETE FROM notes WHERE id = ?
  `,
};

module.exports = noteQueries;
