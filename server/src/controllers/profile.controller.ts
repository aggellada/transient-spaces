import type { Request, Response } from "express";
import {
  followProfileService,
  searchProfileService,
  unfollowProfileService,
} from "../services/profile.service.js";

export const searchProfile = async (req: Request, res: Response) => {
  try {
    const profileId = req.params.id as string;

    const searchedProfile = await searchProfileService(profileId);

    return res
      .status(200)
      .json({ success: true, message: "Successfully fetched profile", data: searchedProfile });
  } catch (error: any) {
    console.error("Error in searchProfile: ", error.message);
    return res.status(500).json({ success: true, message: error.message });
  }
};

export const followProfile = async (req: Request, res: Response) => {
  try {
    const profileIdToFollow = req.params.id as string;
    const profileId = req.user!.profile_id;

    const wasFreshlyFollowed = await followProfileService(profileIdToFollow, profileId);

    if (wasFreshlyFollowed) {
      return res.status(200).json({ message: "Successfully followed user" });
    } else {
      return res.status(200).json({ success: true, message: "You are already following the user" });
    }
  } catch (error: any) {
    console.error("Error in followProfile: ", error.message);
    return res.status(500).json({ success: true, message: error.message });
  }
};

export const unfollowProfile = async (req: Request, res: Response) => {
  try {
    const profileIdToFollow = req.params.id as string;
    const profileId = req.user!.profile_id;

    const wasFreshlyUnfollowed = await unfollowProfileService(profileIdToFollow, profileId);

    if (wasFreshlyUnfollowed) {
      return res.status(200).json({ message: "Successfully unfollowed user" });
    } else {
      return res.status(200).json({ success: true, message: "You already unfollowed the user" });
    }
  } catch (error: any) {
    console.error("Error in followProfile: ", error.message);
    return res.status(500).json({ success: true, message: error.message });
  }
};
