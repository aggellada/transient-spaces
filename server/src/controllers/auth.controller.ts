import type { Request, Response } from "express";
import { createUserService, loginService } from "../services/auth.service.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const newUser = await createUserService(req.body);

    return res.status(200).json({ success: true, message: "New user successfully created", data: newUser });
  } catch (error: any) {
    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loggedInUser = await loginService(req.body);

    generateToken(loggedInUser.id, res);

    return res.status(200).json({ success: true, message: "User logged in", data: loggedInUser });
  } catch (error: any) {
    console.error("Error in login controller:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error: any) {
    console.error("Error in logout controller:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ success: true, data: req.user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
