const conn = require("../utils/db");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const noteQueries = require("../queries/noteQueries");
const CustomError = require("../utils/CustomError");
const tagQueries = require("../queries/tagQueries");
const { getPreSignedUrl, deleteObject } = require("../utils/s3Service");

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

const addImages = async (noteId, images) => {
  try {
    const values = images.map((image) => [uuidv4(), noteId, image]);
    const [result] = await conn.query(noteQueries.createNoteImages, [values]);

    if (result.affectedRows === 0) {
      throw new CustomError("이미지 저장 실패", StatusCodes.BAD_REQUEST);
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
  try {
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
  } catch (err) {
    throw err;
  }
};

const updateNoteImages = async (noteId, images) => {
  try {
    const [existingImages] = await conn.query(
      noteQueries.getNoteImages,
      noteId
    );
    const existingImageNames = existingImages.map(({ name }) => name);

    const deleteList = existingImages.filter(
      (image) => !images.includes(image.name)
    );
    const addList = images
      .filter((image) => !existingImageNames.includes(image))
      .map((name) => [uuidv4(), noteId, name]);

    for (let { id } of deleteList) {
      await conn.query(noteQueries.deleteNoteImage, id);
    }

    if (deleteList.length) {
      const objects = deleteList.map(({ name }) => ({ Key: name }));
      await deleteObject(objects);
    }

    if (addList.length) {
      await conn.query(noteQueries.createNoteImages, [addList]);
    }
  } catch (err) {
    throw err;
  }
};

const deleteNoteImages = async (noteId) => {
  try {
    const [getResult] = await conn.query(noteQueries.getNoteImages, noteId);

    if (getResult.length === 0) return;

    const [deleteResult] = await conn.query(
      noteQueries.deleteNoteImagesByNote,
      noteId
    );

    if (deleteResult.affectedRows === 0) {
      throw CustomError("노트 이미지 삭제 실패", StatusCodes.BAD_REQUEST);
    }
    const objects = getResult.map(({ name }) => ({ Key: name }));
    await deleteObject(objects);
  } catch (err) {
    throw err;
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

const createNote = async (roomId, title, content, images, tags) => {
  try {
    const noteId = await addNote(roomId, title, content);
    if (tags.length) await addTags(roomId, noteId, tags);
    if (images.length) await addImages(noteId, images);

    return {
      message: "노트 등록 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getNotes = async (roomId) => {
  const [getNotesResult] = await conn.query(noteQueries.getNotes, [roomId]);

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
  };
};

const getNoteContent = async (noteId) => {
  try {
    const note = await checkNote(noteId);
    const [imageResult] = await conn.query(noteQueries.getNoteImages, noteId);
    const images = imageResult.map(({ name }) => name);
    return {
      message: "노트 조회 성공",
      content: note.content,
      images,
    };
  } catch (err) {
    throw err;
  }
};

const updateNote = async (noteId, title, content, images, tags) => {
  try {
    const note = await checkNote(noteId);
    await updateNoteContent(noteId, title, content);
    await updateNoteImages(noteId, images);
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
    await deleteNoteImages(noteId); // 이미지 삭제

    const [deleteResult] = await conn.query(noteQueries.deleteNote, noteId); // 노트 삭제

    if (deleteResult.affectedRows === 0)
      throw new CustomError("노트 삭제 실패", StatusCodes.BAD_REQUEST);

    return {
      message: "노트 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

const createPreSigned = async (roomId, fileName) => {
  try {
    const filePath = `${roomId}/${Date.now() + fileName}`;
    const preSignedUrl = await getPreSignedUrl(filePath);

    return {
      message: "url 발급 성공",
      preSignedUrl,
      fileName: filePath,
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
  createPreSigned,
};
