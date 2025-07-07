export interface Subtask {
  id: string;
  description: string;
  completed: boolean;
}

export interface Task {
  id: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  notes: string;
  subtasks: Subtask[];
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  tasks: Task[];
}
