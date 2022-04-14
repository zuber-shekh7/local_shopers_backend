const errorHandler = (err, req, res, next) => {
  res.statusCode = 500;

  return res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export { errorHandler };
