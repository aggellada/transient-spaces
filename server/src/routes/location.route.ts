import express from "express";
import { syncUserLocation } from "../controllers/location.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, syncUserLocation);

export default router;
