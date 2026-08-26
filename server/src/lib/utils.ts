import jwt from "jsonwebtoken";
import type { Response } from "express";

export const generateToken = async (id: string, res: Response) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 60 * 60 * 24 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
