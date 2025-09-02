// services/AI/story.ts
import axios from "axios";
import { errorResponse, successResponse } from "../../utils/resp";


const STORY_ENHANCEMENT_URL = "https://nandankumar.app.n8n.cloud/webhook/story-enhancement";
const SUBTASK_SUGGESTION_URL = "https://nandankumar.app.n8n.cloud/webhook/subtask-Suggestion";

/**
 * Helper: Clean markdown-wrapped JSON (```json ... ```)
 */
const parseMarkdownJson = (text: string) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { raw: text }; // fallback if parsing fails
  }
};

// Wrapper for story enhancement
export const processStoryService = async (story: string) => {
  try {
    const { data } = await axios.post(STORY_ENHANCEMENT_URL, { story });

    // handle n8n response
    const parsed =
      typeof data?.text === "string" ? parseMarkdownJson(data.text) : data;
console.log(parsed);

    return successResponse(parsed, "Story enhanced successfully");
  } catch (err: any) {
    return errorResponse("Failed to enhance story", 500, err?.message || err);
  }
};

// Wrapper for auto subtask generation
export const autoSubtaskGenService = async (story: string) => {
  try {
    const { data } = await axios.post(SUBTASK_SUGGESTION_URL, { subtask: story });

    // handle n8n response
    const parsed =
      typeof data?.text === "string" ? parseMarkdownJson(data.text) : data;

    return successResponse(parsed, "Subtasks generated successfully");
  } catch (err: any) {
    return errorResponse("Failed to generate subtasks", 500, err?.message || err);
  }
};
