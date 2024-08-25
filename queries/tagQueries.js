const tagQueries = {
  createTag: `
    INSERT INTO tags (id, room_id, note_id, name) VALUES ?
  `,

  deleteTag: `
    DELETE FROM tags WHERE note_id = ? AND name = ?
  `,

  getTagsByNote: `
    SELECT name
    FROM tags
    WHERE note_id = ?
  `,

  getTagsByRoom: `
    SELECT name
    FROM tags
    WHERE room_id = ?
    GROUP BY name
    ORDER BY name ASC
  `,
};

module.exports = tagQueries;
