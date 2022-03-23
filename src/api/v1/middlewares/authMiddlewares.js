import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  let token = req.cookies.token;

  // validating bearer token
  if (!token) {
    return res
      .status(403)
      .json({ message: "A Token is required for authentication" });
  }

  try {
    // decoding jwt token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authenticateSeller = (req, res, next) => {
  let token = req.headers.authorization;

  // validating bearer token
  if (!token || !token.startsWith("Bearer")) {
    return res
      .status(403)
      .json({ message: "A Token is required for authentication" });
  }

  token = token.split(" ")[1];

  try {
    // decoding jwt token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.seller = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const allowAdminOnly = (req, res, next) => {
  const user = req.user;

  if (user && user.isAdmin) {
    return next();
  }

  return res.status(401).json({
    message: "You are not authorised to access.",
  });
};

const allowSellerOnly = (req, res, next) => {
  const seller = req.seller;

  if (seller) {
    return next();
  }

  return res.status(401).json({
    message: "You are not authorised to access.",
  });
};

export { authenticate, authenticateSeller, allowSellerOnly, allowAdminOnly };
