import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/auth.service.js";
import type { DecodedToken } from "../types/auth.types.js";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;

    if (!decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    const user = await getUserById(decoded.id);

    req.user = user;

    next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in protectRoute middleware:", errorMessage);

    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      req.user = undefined;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;

    if (!decoded.id) {
      req.user = undefined;
      return next();
    }

    const user = await getUserById(decoded.id);
    req.user = user;

    next();
  } catch (error: any) {
    req.user = undefined;
    next();
  }
};
