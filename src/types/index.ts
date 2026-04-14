export type Role = 'admin' | 'member';

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assigned_to: User | null;
  created_by: User | null;
  created_at: string;
  updated_at: string;
  activities?: TaskActivity[];
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user: User;
  action: string;
  timestamp: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assigned_to: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
