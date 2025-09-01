// controllers/storyController.ts
import type { Request, Response } from "express";
import { autoSubtaskGenService, processStoryService } from "../services/AI/story";


export const processStory = async (req: Request, res: Response) => {
  try {
    const { story } = req.body as { story: string };

    const result = await processStoryService(story);

    res.status(200).json({
      status: 200,
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: (error as Error).message,
    });
  }
};


export const autoSubtaskGen = async (req: Request, res: Response) => {
  try {
    const { story } = req.body as { story: string };
    const result = await autoSubtaskGenService(story);

    res.status(200).json({
      status: 200,
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: (error as Error).message,
    });
  }
};