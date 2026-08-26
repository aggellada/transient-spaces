import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { checkLocationMiddleware } from "../middlewares/location.middleware.js";
import { followProfile, searchProfile, unfollowProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/:id/search", protectRoute, checkLocationMiddleware, searchProfile);
router.get("/:id/follow", protectRoute, checkLocationMiddleware, followProfile);
router.get("/:id/unfollow", protectRoute, checkLocationMiddleware, unfollowProfile);

export default router;
