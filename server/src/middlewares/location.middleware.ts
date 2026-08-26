import type { Request, Response, NextFunction } from "express";
import { sql } from "../lib/db.js";

export const checkLocationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.current_place_id) {
      return res.status(403).json({ success: false, message: "You are not currently in a transient place" });
    }

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in checkLocationMiddleware middleware:", errorMessage);

    return res.status(401).json({ success: false, message: "You are currently not in a transient place" });
  }
};
