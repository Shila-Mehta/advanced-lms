import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

export const authenticate: RequestHandler = (req, res, next) => {

  // console.log(req.cookies.refreshToken);
  // Read token from Authorization header OR cookie
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = tokenFromHeader || req.cookies?.refreshToken;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    console.log(decoded);
    req.user = decoded;
    next();
  } catch(error) {
    console.log(error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorize =
  (...roles: string[]) =>
  ((req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied 🚫" });
    }
    next();
  }) as RequestHandler;
