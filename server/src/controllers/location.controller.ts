import type { Request, Response } from "express";
import { syncUserLocationService } from "../services/location.service.js";

export const syncUserLocation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id!;

    const result = await syncUserLocationService(req.body, userId);

    return res.status(200).json({ success: true, message: "You are in a transient place", data: result });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
