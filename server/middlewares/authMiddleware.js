import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Access denied, token missing!" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Assuming Bearer token
    req.user = verified; // Attach decoded token data to `req.user`
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token!" });
  }
};
