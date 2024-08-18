const conn = require("../utils/db");
const linkQueries = require("../queries/linkQueries");
const memberQueries = require("../queries/memberQueries");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/CustomError");

const createLink = async (roomId, userId, title, link) => {
  try {
    const linkId = uuidv4();
    const [createResult] = await conn.query(linkQueries.createLink, [
      linkId,
      roomId,
      title,
      link,
    ]);

    if (createResult.affectedRows === 0)
      throw new CustomError("자료 등록 실패", StatusCodes.BAD_REQUEST);

    return {
      message: "자료 등록 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getLinks = async (roomId) => {
  try {
    const [linkResult] = await conn.query(linkQueries.getLinks, roomId);

    return {
      message: "자료 조회 성공",
      links: linkResult.map((link) => ({
        id: link.id,
        title: link.title,
        link: link.url,
      })),
    };
  } catch (err) {
    throw err;
  }
};

const deleteLink = async (linkId) => {
  try {
    const [linkResult] = await conn.query(linkQueries.getLinkById, linkId);

    if (linkResult.length === 0) {
      throw new CustomError("자료를 찾을 수 없습니다.", StatusCodes.NOT_FOUND);
    }

    //자료삭제
    const [deleteResult] = await conn.query(linkQueries.deleteLink, linkId);

    if (deleteResult.affectedRows === 0) {
      throw new CustomError("자료 삭제 실패", StatusCodes.NOT_FOUND);
    }

    return {
      message: "자료 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createLink,
  getLinks,
  deleteLink,
};
