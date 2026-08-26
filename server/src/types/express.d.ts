import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        name: string;
        current_place_id: string;
      };
    }
  }
}
