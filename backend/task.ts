import mongoose, { Document, Schema } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create the Schema corresponding to the document interface.
const taskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  tags: {
    type: [String],
    default: [],
  },
  dueDate: {
    type: Date,
  },
}, {
  timestamps: true
});

// 3. Export the Model
export default mongoose.model<ITask>('Task', taskSchema);