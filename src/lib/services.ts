import api from './api';
import type { AuthResponse, LoginCredentials, Task, TaskFormData, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data['data'];
  },
};

export const taskService = {
  async getAll(params?: any): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks', { params });
     return data;
  },

  async getMyTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/my-tasks');
    return data['data'];
  },

  async create(taskData: TaskFormData): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', taskData);
    return data;
  },

  async update(id: string, taskData: Partial<TaskFormData>): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, taskData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getMembers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data['data'];
  },

};
