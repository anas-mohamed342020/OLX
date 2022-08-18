const { ReasonPhrases, StatusCodes } = require("http-status-codes");




function catchError(res,error) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "SERVER ERROR",
    ERROR: "" + error,
    status: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });

}













module.exports  = {catchError}