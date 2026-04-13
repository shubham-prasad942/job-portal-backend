const globalError = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  if (err.code === 11000) {
    statusCode = 400;
    message = "Dublicate field value entered";
  }
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = globalError;
