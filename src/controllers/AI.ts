

// controllers/storyController.ts

import { autoSubtaskGenService, processStoryService } from "../services/AI/story";


export const processStory = async (story: string) => {
  // business logic / service call
  return await processStoryService(story);
};

export const autoSubtaskGen = async ( description: string) => {
  // business logic / service call
  return await autoSubtaskGenService(description);
};
