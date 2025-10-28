import { Timestamp } from 'firebase/firestore';

// Team Status Types
export type TeamStatus = 'active' | 'inactive' | 'archived';

// Team Member Roles
export type TeamRole = 'lead' | 'developer' | 'designer' | 'tester' | 'analyst' | 'manager';

// Team Member Interface
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  teamId: string;
  avatar?: string;
  
  // Contact information
  phone?: string;
  position?: string;
  department?: string;
  
  // Professional information
  skills: string[];
  joinDate: string | Timestamp;
  isActive: boolean;
  
  // Performance metrics
  completedTasks: number;
  totalTasks: number;
  efficiency: number; // 0-100
  
  // Metadata
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
}

// Team Interface
export interface Team {
  id: string;
  name: string;
  description?: string;
  status: TeamStatus;
  members: TeamMember[];
  
  // Team metrics
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  teamEfficiency: number; // 0-100
  
  // Team settings
  color?: string; // Team color for UI
  slackChannel?: string;
  meetingSchedule?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
}

// Team Statistics
export interface TeamStats {
  teamId: string;
  name: string;
  totalMembers: number;
  activeMembers: number;
  
  // Project metrics
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  
  // Task metrics
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  overdueTasks: number;
  
  // Performance metrics
  averageEfficiency: number;
  onTimeCompletionRate: number;
  qualityScore: number;
  
  // Member performance
  memberPerformance: {
    memberId: string;
    memberName: string;
    role: TeamRole;
    completedTasks: number;
    totalTasks: number;
    efficiency: number;
    onTimeCompletion: number;
  }[];
}

// Team Creation Data
export type CreateTeamData = Omit<Team, 
  'id' | 'createdAt' | 'updatedAt' | 'totalProjects' | 'activeProjects' | 
  'completedProjects' | 'totalTasks' | 'completedTasks' | 'teamEfficiency'
>;

// Team Update Data
export type UpdateTeamData = Partial<Omit<Team, 
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'members'
>>;

// Team Member Creation Data
export type CreateTeamMemberData = Omit<TeamMember, 
  'id' | 'createdAt' | 'updatedAt' | 'completedTasks' | 'totalTasks' | 'efficiency'
>;

// Team Member Update Data
export type UpdateTeamMemberData = Partial<Omit<TeamMember, 
  'id' | 'createdAt' | 'updatedAt' | 'teamId'
>>;

// Team Filters
export interface TeamFilters {
  status?: TeamStatus | 'all';
  search?: string;
  hasAvailableCapacity?: boolean;
}

// Team Member Filters
export interface TeamMemberFilters {
  role?: TeamRole | 'all';
  isActive?: boolean;
  search?: string;
}

// Team Performance Report
export interface TeamPerformanceReport {
  teamId: string;
  teamName: string;
  period: {
    start: string;
    end: string;
  };
  
  // Overall metrics
  totalProjects: number;
  completedProjects: number;
  completionRate: number;
  averageProjectDuration: number;
  
  // Task metrics
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  averageTaskDuration: number;
  
  // Quality metrics
  bugCount: number;
  bugFixRate: number;
  customerSatisfaction?: number;
  
  // Team capacity
  totalCapacity: number; // Total available hours
  utilizedCapacity: number; // Actually used hours
  utilizationRate: number;
  
  // Member contributions
  memberContributions: {
    memberId: string;
    memberName: string;
    role: TeamRole;
    tasksCompleted: number;
    storyPoints: number;
    efficiency: number;
    availability: number;
  }[];
}

// Team List Item (for optimized lists)
export interface TeamListItem {
  id: string;
  name: string;
  status: TeamStatus;
  memberCount: number;
  activeProjects: number;
  totalProjects: number;
  teamEfficiency: number;
  color?: string;
  isSelectable?: boolean;
}

// Team Member List Item (for optimized lists)
export interface TeamMemberListItem {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  teamId: string;
  teamName: string;
  avatar?: string;
  isActive: boolean;
  completedTasks: number;
  totalTasks: number;
  efficiency: number;
  isSelectable?: boolean;
}

// Available Team Member (for assignment)
export interface AvailableTeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  currentTeam?: string;
  avatar?: string;
  skills: string[];
  isAvailable: boolean;
}

// Export all team-related types
export type {
  TeamStatus,
  TeamRole,
};