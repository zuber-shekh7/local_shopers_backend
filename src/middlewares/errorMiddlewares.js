const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? res.statusCode : 500;
  res.status(statusCode);

  return res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
export { errorHandler };
