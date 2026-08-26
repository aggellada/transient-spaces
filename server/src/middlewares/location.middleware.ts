import type { Request, Response, NextFunction } from "express";
import { sql } from "../lib/db.js";

export const checkLocationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [userCurrentPlace] = await sql`
        SELECT current_place_id from USERS
        where id=${req.user!.id}
    `;

    if (!userCurrentPlace) {
      return res.status(500).json({ success: false, message: "You are not in a transient place" });
    }

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in checkLocationMiddleware middleware:", errorMessage);

    return res.status(401).json({ success: false, message: "You are currently not in a transient place" });
  }
};
