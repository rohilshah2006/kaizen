import axios from 'axios';
import type { Task } from './types';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Points to your backend
});

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await API.get('/tasks');
  return data;
};

export const createTask = async (task: { title: string; description: string }) => {
  const { data } = await API.post('/tasks', task);
  return data;
};

export const updateTaskStatus = async ({ id, status }: { id: string; status: string }) => {
  const { data } = await API.put(`/tasks/${id}`, { status });
  return data;
};

export const deleteTask = async (id: string) => {
  await API.delete(`/tasks/${id}`);
};