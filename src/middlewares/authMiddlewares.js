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

const authenticateSeller = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(403)
      .json({ message: "A Token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.seller = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  return next();
};

const allowSellerOnly = (req, res, next) => {
  const seller = req.seller;

  if (seller && seller.isSeller) {
    return next();
  }

  return res.status(401).json({
    message: "You are not authorised to access.",
  });
};

export { authenticate, authenticateSeller, allowSellerOnly };
