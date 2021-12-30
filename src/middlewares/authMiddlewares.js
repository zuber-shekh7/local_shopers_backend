import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(403)
      .json({ message: "A Token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  return next();
};

export { authenticate };
