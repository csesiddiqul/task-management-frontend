import api from './api';
import type { AuthResponse, LoginCredentials, Task, TaskFormData, User } from '@/types';

// For demo: mock data when API is unavailable
const DEMO_MODE = false;

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Karim Ahmed', email: 'karim@demo.com', role: 'member' },
  { id: '3', name: 'Sara Ali', email: 'sara@demo.com', role: 'member' },
  { id: '4', name: 'Youssef Nabil', email: 'youssef@demo.com', role: 'member' },
];

let mockTasks: Task[] = [
  {
    id: '1', title: 'Design landing page', description: 'Create mockups for the new landing page', status: 'completed',
    priority: 'high', due_date: '2026-04-10', assigned_to: mockUsers[1], created_by: mockUsers[0],
    created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-10T14:00:00Z',
    activities: [
      { id: 'a1', task_id: '1', user: mockUsers[1], action: 'started task', timestamp: '2026-04-02T09:00:00Z' },
      { id: 'a2', task_id: '1', user: mockUsers[1], action: 'completed task', timestamp: '2026-04-10T14:00:00Z' },
    ],
  },
  {
    id: '2', title: 'Implement API endpoints', description: 'Build REST API for task management', status: 'in_progress',
    priority: 'high', due_date: '2026-04-15', assigned_to: mockUsers[2], created_by: mockUsers[0],
    created_at: '2026-04-03T08:00:00Z', updated_at: '2026-04-11T10:00:00Z',
    activities: [
      { id: 'a3', task_id: '2', user: mockUsers[2], action: 'started task', timestamp: '2026-04-05T09:00:00Z' },
    ],
  },
  {
    id: '3', title: 'Write unit tests', description: 'Add test coverage for core modules', status: 'pending',
    priority: 'medium', due_date: '2026-04-08', assigned_to: mockUsers[3], created_by: mockUsers[0],
    created_at: '2026-04-04T12:00:00Z', updated_at: '2026-04-04T12:00:00Z',
    activities: [],
  },
  {
    id: '4', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for deployment', status: 'review',
    priority: 'medium', due_date: '2026-04-14', assigned_to: mockUsers[1], created_by: mockUsers[0],
    created_at: '2026-04-05T14:00:00Z', updated_at: '2026-04-12T08:00:00Z',
    activities: [
      { id: 'a4', task_id: '4', user: mockUsers[1], action: 'submitted for review', timestamp: '2026-04-12T08:00:00Z' },
    ],
  },
  {
    id: '5', title: 'Database optimization', description: 'Optimize slow queries and add indexes', status: 'pending',
    priority: 'low', due_date: '2026-04-20', assigned_to: mockUsers[2], created_by: mockUsers[0],
    created_at: '2026-04-06T10:00:00Z', updated_at: '2026-04-06T10:00:00Z',
    activities: [],
  },
  {
    id: '6', title: 'Update documentation', description: 'Update API docs and README', status: 'in_progress',
    priority: 'low', due_date: '2026-04-18', assigned_to: mockUsers[3], created_by: mockUsers[0],
    created_at: '2026-04-07T11:00:00Z', updated_at: '2026-04-11T16:00:00Z',
    activities: [
      { id: 'a5', task_id: '6', user: mockUsers[3], action: 'started task', timestamp: '2026-04-10T09:00:00Z' },
    ],
  },
];

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
