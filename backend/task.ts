import mongoose, { Document, Schema } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface ITask extends Document {
  title: string;
  description?: string; // The '?' means it's optional
  status: 'To Do' | 'In Progress' | 'Completed'; // Strict union type
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
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do',
  },
}, {
  timestamps: true // Automagically manages createdAt and updatedAt
});

// 3. Export the Model
export default mongoose.model<ITask>('Task', taskSchema);