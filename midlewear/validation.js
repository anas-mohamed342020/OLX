const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const headersMethods = ["body", "params", "query", "headers"];

const validation = (schema) => {
  return (req, res, next) => {
    const result = [];
    headersMethods.forEach((ele) => {
      if (schema[ele]) {
        const validationResult = schema[ele].validate(req[ele], {
          abortEarly: false,
        });
        if (validationResult.error) {
          result.push(validationResult.error);
        }
      }
    });
    if (result.length) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          message: "Validation Error",
          ERROR: result,
          status: ReasonPhrases.BAD_REQUEST,
        });
    } else {
      next();
    }
  };
};

module.exports = { validation };
