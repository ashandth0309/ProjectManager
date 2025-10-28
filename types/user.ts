import { Timestamp } from 'firebase/firestore';
import { UserRole } from '../constants/roles';
import { Team, TeamMember } from './team';

// User Status Types
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    taskAssigned: boolean;
    taskUpdated: boolean;
    projectUpdates: boolean;
    deadlineReminders: boolean;
  };
  dashboard: {
    defaultView: 'list' | 'grid' | 'calendar';
    showCompletedTasks: boolean;
    showArchivedProjects: boolean;
  };
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

// User Profile Interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  
  // Personal information
  avatar?: string;
  phone?: string;
  position?: string;
  department?: string;
  bio?: string;
  
  // Professional information
  skills: string[];
  experience?: string;
  education?: string;
  certifications: string[];
  
  // Status and metadata
  status: UserStatus;
  lastLoginAt?: string | Timestamp;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  
  // Preferences
  preferences: UserPreferences;
  
  // Team information
  teamId?: string;
  teamRole?: string;
  teams: string[]; // Array of team IDs
  
  // Statistics
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  efficiency: number; // 0-100
  onTimeCompletionRate: number; // 0-100
  
  // Metadata
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  createdBy?: string;
}

// User Session Information
export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  teamId?: string;
  teamRole?: string;
  lastLoginAt: string | Timestamp;
  permissions: string[];
}

// User Activity Log
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  resourceType: 'project' | 'task' | 'sprint' | 'team' | 'user';
  resourceId?: string;
  timestamp: string | Timestamp;
  ipAddress?: string;
  userAgent?: string;
}

// User Statistics
export interface UserStats {
  userId: string;
  period: {
    start: string;
    end: string;
  };
  
  // Task metrics
  tasksAssigned: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksOverdue: number;
  taskCompletionRate: number;
  
  // Time metrics
  totalEstimatedHours: number;
  totalActualHours: number;
  timeEfficiency: number;
  averageTaskDuration: number;
  
  // Project metrics
  projectsInvolved: number;
  projectsCompleted: number;
  projectCompletionRate: number;
  
  // Quality metrics
  bugsReported: number;
  bugsFixed: number;
  codeReviewScore?: number;
  
  // Availability
  workingDays: number;
  leaveDays: number;
  availability: number;
}

// User Creation Data
export type CreateUserData = Omit<UserProfile, 
  'uid' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'emailVerified' | 
  'twoFactorEnabled' | 'totalProjects' | 'completedProjects' | 
  'totalTasks' | 'completedTasks' | 'efficiency' | 'onTimeCompletionRate' | 
  'teams' | 'status'
> & {
  password: string;
};

// User Update Data
export type UpdateUserData = Partial<Omit<UserProfile, 
  'uid' | 'createdAt' | 'updatedAt' | 'email' | 'lastLoginAt' | 
  'emailVerified' | 'totalProjects' | 'completedProjects' | 
  'totalTasks' | 'completedTasks' | 'efficiency' | 'onTimeCompletionRate'
>>;

// User Registration Data
export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  teamId?: string;
}

// User Login Data
export interface UserLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// User Password Reset Data
export interface UserPasswordResetData {
  email: string;
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

// User List Item (for optimized lists)
export interface UserListItem {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  teamId?: string;
  teamName?: string;
  position?: string;
  completedTasks: number;
  totalTasks: number;
  efficiency: number;
  lastLoginAt?: string | Timestamp;
  isSelectable?: boolean;
}

// User Filters
export interface UserFilters {
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  team?: string;
  search?: string;
  isActive?: boolean;
}

// User Permission Check
export interface UserPermission {
  action: string;
  resource: string;
  granted: boolean;
}

// User Notification Settings
export interface UserNotificationSettings {
  // Email notifications
  emailTaskAssigned: boolean;
  emailTaskUpdated: boolean;
  emailTaskCompleted: boolean;
  emailProjectUpdates: boolean;
  emailDeadlineReminders: boolean;
  emailTeamUpdates: boolean;
  
  // Push notifications
  pushTaskAssigned: boolean;
  pushTaskUpdated: boolean;
  pushTaskCompleted: boolean;
  pushProjectUpdates: boolean;
  pushDeadlineReminders: boolean;
  pushTeamUpdates: boolean;
  
  // In-app notifications
  inAppTaskAssigned: boolean;
  inAppTaskUpdated: boolean;
  inAppTaskCompleted: boolean;
  inAppProjectUpdates: boolean;
  inAppDeadlineReminders: boolean;
  inAppTeamUpdates: boolean;
}

// User Dashboard Preferences
export interface UserDashboardPreferences {
  // Layout
  defaultView: 'list' | 'grid' | 'calendar';
  sidebarCollapsed: boolean;
  
  // Content
  showCompletedTasks: boolean;
  showArchivedProjects: boolean;
  showTeamProjects: boolean;
  showPersonalTasks: boolean;
  
  // Widgets
  visibleWidgets: string[];
  widgetOrder: string[];
  
  // Refresh rate
  autoRefresh: boolean;
  refreshInterval: number; // minutes
}

// Export all user-related types
export type {
  UserStatus,
};