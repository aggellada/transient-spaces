import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        current_place_id: string | null;
        profile_id: string;
      };
    }
  }
}
