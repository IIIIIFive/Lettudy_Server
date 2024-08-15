const tagQueries = require("../queries/tagQueries");
const conn = require("../utils/db");

const getTags = async (roomId) => {
  const [result] = await conn.query(tagQueries.getTagsByRoom, roomId);

  return {
    message: "태그 조회 성공",
    tags: result.map(({ name }) => name),
  };
};

module.exports = { getTags };
