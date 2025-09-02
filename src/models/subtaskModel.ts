import { model, Schema, type Document, type Types } from "mongoose";

export interface ISubtask extends Document {
  parentTaskId: Types.ObjectId;//task to which this subtask belongs
  title: string;
  description: string;
  dueDate?: Date;
  priority?: string;
  assignees?: Types.ObjectId[];
  status: string;
  storyPoints?: number;
  statusHistory: { from: string; to: string; timestamp: Date }[];
  comments: { author: Types.ObjectId; timestamp: Date; text: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const subtaskSchema = new Schema<ISubtask>({
  parentTaskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  priority: { type: String },
  assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, required: true },
  storyPoints: { type: Number },
  statusHistory: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      timestamp: { type: Date, required: true }
    }
  ],
  comments: [
    {
      author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      timestamp: { type: Date, default: Date.now },
      text: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});



export const SubtaskModel = model<ISubtask>('Subtask', subtaskSchema);
