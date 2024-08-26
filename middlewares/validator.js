const { StatusCodes } = require("http-status-codes");

const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: result.array()[0].msg });
      }
    }

    next();
  };
};

module.exports = { validate };
