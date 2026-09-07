import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?:
        | {
            id: string;
            username: string;
            first_name: string;
            last_name: string;
            current_place_id: string | null;
            profile_id: string;
          }
        | undefined;
    }
  }
}
