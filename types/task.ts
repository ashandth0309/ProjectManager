// types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'ongoing' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  project?: {
    id: string;
    name: string;
    color?: string;
  };
  dueDate?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  comments?: Comment[];
  subtasks?: Subtask[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string | Date;
  completedAt?: string | Date;
}

// Task status options
export const TASK_STATUS = {
  NOT_STARTED: 'not-started',
  ONGOING: 'ongoing',
  DONE: 'done',
} as const;

// Task priority options
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Type guards
export const isTaskStatus = (status: string): status is Task['status'] => {
  return Object.values(TASK_STATUS).includes(status as any);
};

export const isTaskPriority = (priority: string): priority is Task['priority'] => {
  return Object.values(TASK_PRIORITY).includes(priority as any);
};

// Helper functions
export const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'not-started':
      return '#6c757d';
    case 'ongoing':
      return '#ffc107';
    case 'done':
      return '#28a745';
    default:
      return '#6c757d';
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'low':
      return '#28a745';
    case 'medium':
      return '#ffc107';
    case 'high':
      return '#fd7e14';
    case 'urgent':
      return '#dc3545';
    default:
      return '#6c757d';
  }
};

export const getPriorityLabel = (priority: Task['priority']): string => {
  switch (priority) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    case 'urgent':
      return 'Urgent';
    default:
      return 'Medium';
  }
};

// Filter and sort utilities
export const filterTasksByStatus = (tasks: Task[], status: Task['status']): Task[] => {
  return tasks.filter(task => task.status === status);
};

export const filterTasksByAssignee = (tasks: Task[], assigneeId: string): Task[] => {
  return tasks.filter(task => task.assignee.id === assigneeId);
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

// Validation
export const validateTask = (task: Partial<Task>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!task.assignee || !task.assignee.id) {
    errors.push('Assignee is required');
  }

  if (!task.status || !isTaskStatus(task.status)) {
    errors.push('Valid status is required');
  }

  if (!task.priority || !isTaskPriority(task.priority)) {
    errors.push('Valid priority is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Default task for initialization
export const createDefaultTask = (assignee: { id: string; name: string }): Partial<Task> => ({
  title: '',
  description: '',
  status: 'not-started',
  priority: 'medium',
  assignee,
  dueDate: undefined,
  estimatedHours: 0,
  tags: [],
  attachments: [],
  comments: [],
  subtasks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});