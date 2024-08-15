const conn = require("../utils/db");
const linkQueries = require("../queries/linkQueries");
const memberQueries = require("../queries/memberQueries");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/CustomError");

const checkMemberByRoomId = async (roomId, userId) => {
  const memberResult = await conn.query(memberQueries.checkMember, [
    roomId,
    userId,
  ]);

  if (memberResult[0][0].count === 0) {
    throw new CustomError(
      "해당 스터디에 가입되어 있지 않은 회원입니다.",
      StatusCodes.FORBIDDEN
    );
  }
};

const createLink = async (roomId, userId, title, link) => {
  try {
    // 방의 유저인지 확인
    await checkMemberByRoomId(roomId, userId);

    const linkId = uuidv4();
    await conn.query(linkQueries.createLink, [linkId, roomId, title, link]);

    // 등록 날짜 조회
    const linkResult = await conn.query(linkQueries.getDate, linkId);

    return {
      message: "자료 등록 성공",
      links: {
        id: linkId,
        title,
        link,
        createdAt: linkResult[0][0].created_at,
      },
    };
  } catch (err) {
    throw err;
  }
};

const getLinks = async (roomId, userId) => {
  try {
    // 방의 유저인지 확인
    await checkMemberByRoomId(roomId, userId);

    const [linkResult] = await conn.query(linkQueries.getLinks, roomId);

    if (linkResult.length === 0) {
      throw new CustomError("자료가 존재하지 않습니다.", StatusCodes.NOT_FOUND);
    }

    return {
      message: "자료 조회 성공",
      links: linkResult.map((link) => ({
        id: link.id,
        title: link.title,
        link: link.url,
        createdAt: link.created_at,
      })),
    };
  } catch (err) {
    throw err;
  }
};

const deleteLink = async (linkId, userId) => {
  try {
    // 삭제할 링크를 조회하여 roomId 확인
    const [linkResult] = await conn.query(linkQueries.getLinkById, linkId);

    if (linkResult.length === 0) {
      throw new CustomError("자료를 찾을 수 없습니다.", StatusCodes.NOT_FOUND);
    }

    const roomId = linkResult[0].room_id;

    // 방의 유저인지 확인
    await checkMemberByRoomId(roomId, userId);

    //자료삭제
    const [deleteResult] = await conn.query(linkQueries.deleteLink, linkId);

    if (deleteResult.affectedRows === 0) {
      throw new CustomError("자료삭제 실패", StatusCodes.NOT_FOUND);
    }

    return {
      message: "자료삭제 성공",
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
