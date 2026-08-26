import type { Request, Response } from "express";
import { getProfileService } from "../services/profile.service.js";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profileId = req.params.id as string;

    const userProfile = await getProfileService(profileId);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: true, message: error.message });
  }
};
