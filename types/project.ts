import { Timestamp } from 'firebase/firestore';
import { Team, TeamMember } from './team';

// Project Status Types
export type ProjectStatus = 'not-started' | 'ongoing' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

// Project Interface
export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string | Timestamp;
  endDate?: string | Timestamp;
  assignedTeam: Team;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number; // 0-100
  budget?: number;
  tags: string[];
  createdBy: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  
  // Analytics fields
  totalTasks: number;
  completedTasks: number;
  totalSprints: number;
  completedSprints: number;
  
  // Metadata
  isActive: boolean;
  isArchived: boolean;
}

// Sprint Status Types
export type SprintStatus = 'not-started' | 'in-progress' | 'completed' | 'cancelled';

// Sprint Interface
export interface Sprint {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  startDate: string | Timestamp;
  endDate: string | Timestamp;
  status: SprintStatus;
  goal?: string;
  
  // Progress tracking
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  
  // Velocity and metrics
  plannedVelocity: number;
  actualVelocity?: number;
  storyPoints: number;
  completedStoryPoints?: number;
  
  // Metadata
  createdBy: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  isActive: boolean;
}

// Task Status Types
export type TaskStatus = 'not-started' | 'ongoing' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

// Task Interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  sprintId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TeamMember;
  
  // Time tracking
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string | Timestamp;
  startDate?: string | Timestamp;
  completedDate?: string | Timestamp;
  
  // Task details
  storyPoints?: number;
  taskType: 'feature' | 'bug' | 'improvement' | 'maintenance' | 'documentation';
  labels: string[];
  dependencies: string[]; // Task IDs this task depends on
  
  // Progress tracking
  progress: number; // 0-100
  checklist?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  
  // Metadata
  createdBy: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  lastUpdatedBy?: string;
  
  // Comments and attachments (would be in subcollection in Firestore)
  commentCount: number;
  attachmentCount: number;
}

// Project Statistics
export interface ProjectStats {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  overdueTasks: number;
  totalSprints: number;
  completedSprints: number;
  activeSprints: number;
  teamPerformance: number; // 0-100
  budgetUtilization: number; // 0-100
  timelineProgress: number; // 0-100
}

// Sprint Statistics
export interface SprintStats {
  sprintId: string;
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  velocity: number;
  burndownData: {
    date: string;
    remainingPoints: number;
  }[];
}

// Task Filters
export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  assignee?: string; // User ID
  sprint?: string; // Sprint ID
  project?: string; // Project ID
  dueDate?: 'today' | 'week' | 'month' | 'overdue';
  search?: string;
}

// Project Creation Data
export type CreateProjectData = Omit<Project, 
  'id' | 'createdAt' | 'updatedAt' | 'progress' | 'totalTasks' | 
  'completedTasks' | 'totalSprints' | 'completedSprints' | 
  'isActive' | 'isArchived'
>;

// Sprint Creation Data
export type CreateSprintData = Omit<Sprint, 
  'id' | 'createdAt' | 'updatedAt' | 'totalTasks' | 'completedTasks' | 
  'inProgressTasks' | 'notStartedTasks' | 'actualVelocity' | 
  'completedStoryPoints' | 'isActive'
>;

// Task Creation Data
export type CreateTaskData = Omit<Task, 
  'id' | 'createdAt' | 'updatedAt' | 'progress' | 'commentCount' | 
  'attachmentCount' | 'lastUpdatedBy'
>;

// Project Update Data
export type UpdateProjectData = Partial<Omit<Project, 
  'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>>;

// Sprint Update Data
export type UpdateSprintData = Partial<Omit<Sprint, 
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'
>>;

// Task Update Data
export type UpdateTaskData = Partial<Omit<Task, 
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'
>>;

// Project List Item (for optimized lists)
export interface ProjectListItem {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  assignedTeam: {
    id: string;
    name: string;
  };
  startDate: string | Timestamp;
  totalTasks: number;
  completedTasks: number;
  dueSoon?: boolean;
  isOverdue?: boolean;
}

// Task List Item (for optimized lists)
export interface TaskListItem {
  id: string;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectName: string;
  sprintId?: string;
  sprintName?: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string | Timestamp;
  storyPoints?: number;
  progress: number;
  isOverdue?: boolean;
}

// Export all project-related types
export type {
  ProjectStatus,
  ProjectPriority,
  SprintStatus,
  TaskStatus,
  TaskPriority,
};