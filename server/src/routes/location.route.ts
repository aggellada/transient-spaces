import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { syncUserLocation } from "../controllers/location.controller.js";

const router = express.Router();

router.post("/", protectRoute, syncUserLocation);

export default router;
