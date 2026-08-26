import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { checkLocationMiddleware } from "../middlewares/location.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("", protectRoute, checkLocationMiddleware, getProfile);

export default router;
