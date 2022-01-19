const notFoundMiddleware = (req, res) => {
  return res.status(404).json({
    message: `Invalid route: ${req.originalUrl}`,
  });
};

export default notFoundMiddleware;
