import type { Request, Response, NextFunction } from "express";

export const checkLocationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const placeId = req.query.placeId || req.body.placeId || req.user?.current_place_id;

    if (!placeId) {
      return res.status(403).json({
        success: false,
        message: "You must be inside a transient place to access this.",
      });
    }

    if (!req.query.placeId) {
      req.query.placeId = placeId as string;
    }

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in checkLocationMiddleware:", errorMessage);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying location.",
    });
  }
};
