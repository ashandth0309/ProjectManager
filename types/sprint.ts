import { Timestamp } from 'firebase/firestore';
import { Task, TaskStatus } from './project';

// Re-export SprintStatus from project for convenience
export type { SprintStatus } from './project';

// Sprint with extended details including tasks
export interface SprintWithTasks extends Sprint {
  tasks: Task[];
}

// Sprint Burndown Chart Data
export interface BurndownData {
  date: string;
  ideal: number; // Ideal remaining story points
  actual: number; // Actual remaining story points
}

// Sprint Velocity Data
export interface VelocityData {
  sprintId: string;
  sprintName: string;
  plannedPoints: number;
  completedPoints: number;
  velocity: number;
}

// Sprint Progress Data
export interface SprintProgress {
  sprintId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  completionPercentage: number;
}

// Sprint Creation Form Data
export interface SprintFormData {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  goal?: string;
  plannedVelocity: number;
}

// Sprint Update Form Data
export interface SprintUpdateData {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  plannedVelocity?: number;
  status?: SprintStatus;
}

// Sprint Filters
export interface SprintFilters {
  status?: SprintStatus | 'all';
  project?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Sprint Statistics
export interface SprintStatistics {
  sprintId: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  
  // Task metrics
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  blockedTasks: number;
  
  // Story point metrics
  totalStoryPoints: number;
  completedStoryPoints: number;
  remainingStoryPoints: number;
  
  // Time metrics
  totalEstimatedHours: number;
  totalActualHours: number;
  timeEfficiency: number; // (estimated/actual) * 100
  
  // Velocity
  plannedVelocity: number;
  actualVelocity: number;
  velocityEfficiency: number; // (actual/planned) * 100
  
  // Team metrics
  teamMembers: string[];
  tasksByStatus: Record<TaskStatus, number>;
  tasksByAssignee: Record<string, number>;
}

// Sprint Report
export interface SprintReport {
  sprint: Sprint;
  statistics: SprintStatistics;
  burndownData: BurndownData[];
  completedTasks: Task[];
  incompleteTasks: Task[];
  teamPerformance: {
    memberId: string;
    memberName: string;
    completedTasks: number;
    totalTasks: number;
    storyPoints: number;
    efficiency: number;
  }[];
}

// Sprint List Item (for optimized lists)
export interface SprintListItem {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: SprintStatus;
  startDate: string | Timestamp;
  endDate: string | Timestamp;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  isActive: boolean;
  daysRemaining: number;
  isOverdue: boolean;
}

// Export all sprint-related types
export type {
  Sprint,
  CreateSprintData,
  UpdateSprintData,
} from './project';