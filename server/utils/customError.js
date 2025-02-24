class CustomError extends Error {
  httpStatusCode;
  message;

  constructor(httpStatusCode, message) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.message = message;
  }
}

module.exports = {
  CustomHttpError: CustomError,
};
