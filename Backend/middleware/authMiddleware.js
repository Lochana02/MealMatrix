import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied"
    });
  }

  try {
    const secret = process.env.SECRET || "development-key-change-me";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.type === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }
};
