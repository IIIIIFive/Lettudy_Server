const conn = require("../utils/db");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const noteQueries = require("../queries/noteQueries");
const CustomError = require("../utils/CustomError");
const tagQueries = require("../queries/tagQueries");

const addNote = async (roomId, title, content) => {
  try {
    const noteId = uuidv4();
    const values = [noteId, roomId, title, content];
    const [result] = await conn.query(noteQueries.createNote, values);

    if (result.affectedRows === 0) {
      throw new CustomError("노트 생성 실패", StatusCodes.BAD_REQUEST);
    }

    return noteId;
  } catch (err) {
    throw err;
  }
};

const addTags = async (roomId, noteId, tags) => {
  try {
    const values = tags.map((tag) => [uuidv4(), roomId, noteId, tag]);
    const [result] = await conn.query(tagQueries.createTag, [values]);

    if (result.affectedRows === 0) {
      throw new CustomError("태그 생성 실패", StatusCodes.BAD_REQUEST);
    }
  } catch (err) {
    throw err;
  }
};

const getTagsByNote = async (noteId) => {
  try {
    const [result] = await conn.query(tagQueries.getTagsByNote, noteId);

    return result.map(({ name }) => name);
  } catch (err) {
    throw err;
  }
};

const updateNoteContent = async (noteId, title, content) => {
  try {
    const [updateResult] = await conn.query(noteQueries.updateNote, [
      title,
      content,
      noteId,
    ]);

    if (updateResult.affectedRows === 0) {
      throw new CustomError("노트 수정 실패", StatusCodes.BAD_REQUEST);
    }
  } catch (err) {
    throw err;
  }
};

const updateNoteTags = async (noteId, roomId, tags) => {
  const [getTagsResult] = await conn.query(tagQueries.getTagsByNote, noteId);
  const existingTags = getTagsResult.map((tag) => tag.name);

  const deleteList = existingTags.filter((tag) => !tags.includes(tag));
  const addList = tags
    .filter((tag) => !existingTags.includes(tag))
    .map((name) => [uuidv4(), roomId, noteId, name]);

  for (let name of deleteList) {
    await conn.query(tagQueries.deleteTag, [noteId, name]);
  }

  if (addList.length) {
    await conn.query(tagQueries.createTag, [addList]);
  }
};

const checkNote = async (noteId) => {
  try {
    const [[note]] = await conn.query(noteQueries.getNote, noteId);
    if (!note) {
      throw new CustomError("존재하지 않는 노트입니다", StatusCodes.NOT_FOUND);
    }

    return note;
  } catch (err) {
    throw err;
  }
};

const createNote = async (roomId, title, content, tags) => {
  try {
    const noteId = await addNote(roomId, title, content);
    await addTags(roomId, noteId, tags);

    return {
      message: "노트 등록 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getNotes = async (roomId, tags, limit, currentPage) => {
  const offset = (currentPage - 1) * limit;

  const [[{ totalCount }]] = tags.length
    ? await conn.query(noteQueries.getCountFilteredByTags, [roomId, [tags]])
    : await conn.query(noteQueries.getCount, roomId);

  const [getNotesResult] = tags.length
    ? await conn.query(noteQueries.getNotesFilteredByTags, [
        roomId,
        [tags],
        limit,
        offset,
      ])
    : await conn.query(noteQueries.getNotes, [roomId, limit, offset]);

  if (getNotesResult.length === 0) {
    throw new CustomError("노트 조회 실패", StatusCodes.NOT_FOUND);
  }

  const notes = [];
  for (let note of getNotesResult) {
    const tagsResult = await getTagsByNote(note.noteId);
    notes.push({ ...note, tags: tagsResult });
  }

  return {
    message: "노트 조회 성공",
    notes,
    pagination: {
      currentPage,
      totalCount,
    },
  };
};

const getNoteContent = async (noteId) => {
  try {
    const note = await checkNote(noteId);

    return {
      message: "노트 조회 성공",
      content: note.content,
    };
  } catch (err) {
    throw err;
  }
};

const updateNote = async (noteId, title, content, tags) => {
  try {
    const note = await checkNote(noteId);
    await updateNoteContent(noteId, title, content);
    await updateNoteTags(noteId, note.room_id, tags);

    return {
      message: "노트 수정 성공",
    };
  } catch (err) {
    throw err;
  }
};

const deleteNote = async (noteId) => {
  try {
    await checkNote(noteId);

    const [deleteResult] = await conn.query(noteQueries.deleteNote, noteId);

    if (deleteResult.affectedRows === 0)
      throw new CustomError("노트 삭제 실패", StatusCodes.BAD_REQUEST);

    return {
      message: "노트 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getNoteContent,
};
