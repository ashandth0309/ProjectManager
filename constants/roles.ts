// User Role Types
export type UserRole = 'admin' | 'user' | 'manager' | 'team_lead';

// Role Permissions Interface
export interface RolePermissions {
  // Dashboard Access
  canViewDashboard: boolean;
  
  // Project Management
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canViewAllProjects: boolean;
  
  // Task Management
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canAssignTasks: boolean;
  canViewAllTasks: boolean;
  
  // Team Management
  canCreateTeams: boolean;
  canEditTeams: boolean;
  canDeleteTeams: boolean;
  canManageTeamMembers: boolean;
  canViewAllTeams: boolean;
  
  // User Management
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  
  // Analytics & Reports
  canViewAnalytics: boolean;
  canGenerateReports: boolean;
  
  // System Settings
  canManageSettings: boolean;
}

// Role Definitions
export const ROLES: Record<UserRole, RolePermissions> = {
  admin: {
    // Dashboard
    canViewDashboard: true,
    
    // Project Management
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canViewAllProjects: true,
    
    // Task Management
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canAssignTasks: true,
    canViewAllTasks: true,
    
    // Team Management
    canCreateTeams: true,
    canEditTeams: true,
    canDeleteTeams: true,
    canManageTeamMembers: true,
    canViewAllTeams: true,
    
    // User Management
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    
    // Analytics & Reports
    canViewAnalytics: true,
    canGenerateReports: true,
    
    // System Settings
    canManageSettings: true,
  },

  manager: {
    // Dashboard
    canViewDashboard: true,
    
    // Project Management
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: false,
    canViewAllProjects: true,
    
    // Task Management
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canAssignTasks: true,
    canViewAllTasks: true,
    
    // Team Management
    canCreateTeams: false,
    canEditTeams: true,
    canDeleteTeams: false,
    canManageTeamMembers: true,
    canViewAllTeams: true,
    
    // User Management
    canViewUsers: true,
    canEditUsers: false,
    canDeleteUsers: false,
    
    // Analytics & Reports
    canViewAnalytics: true,
    canGenerateReports: true,
    
    // System Settings
    canManageSettings: false,
  },

  team_lead: {
    // Dashboard
    canViewDashboard: true,
    
    // Project Management
    canCreateProjects: false,
    canEditProjects: true,
    canDeleteProjects: false,
    canViewAllProjects: false,
    
    // Task Management
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    
    // Team Management
    canCreateTeams: false,
    canEditTeams: false,
    canDeleteTeams: false,
    canManageTeamMembers: true,
    canViewAllTeams: false,
    
    // User Management
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    
    // Analytics & Reports
    canViewAnalytics: true,
    canGenerateReports: false,
    
    // System Settings
    canManageSettings: false,
  },

  user: {
    // Dashboard
    canViewDashboard: true,
    
    // Project Management
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    
    // Task Management
    canCreateTasks: false,
    canEditTasks: true, // Can edit own tasks
    canDeleteTasks: false,
    canAssignTasks: false,
    canViewAllTasks: false,
    
    // Team Management
    canCreateTeams: false,
    canEditTeams: false,
    canDeleteTeams: false,
    canManageTeamMembers: false,
    canViewAllTeams: false,
    
    // User Management
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    
    // Analytics & Reports
    canViewAnalytics: false,
    canGenerateReports: false,
    
    // System Settings
    canManageSettings: false,
  },
};

// Role Display Names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Project Manager',
  team_lead: 'Team Lead',
  user: 'Team Member',
};

// Role Descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Full system access with all permissions. Can manage users, projects, teams, and system settings.',
  manager: 'Can manage projects and teams, assign tasks, and view analytics. Limited user management capabilities.',
  team_lead: 'Can manage team members and tasks within their assigned teams. Limited project management capabilities.',
  user: 'Can view assigned tasks and projects. Limited to personal task management.',
};

// Role Hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  manager: 3,
  team_lead: 2,
  user: 1,
};

// Role-based Route Access
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [
    '/(admin)',
    '/(admin)/projects',
    '/(admin)/teams',
    '/(admin)/users',
    '/(admin)/analytics',
    '/(admin)/settings',
    '/(user)',
  ],
  manager: [
    '/(admin)',
    '/(admin)/projects',
    '/(admin)/teams',
    '/(admin)/analytics',
    '/(user)',
  ],
  team_lead: [
    '/(admin)',
    '/(admin)/projects',
    '/(admin)/teams',
    '/(user)',
  ],
  user: [
    '/(user)',
    '/(user)/tasks',
  ],
};

// Role-based Feature Flags
export const ROLE_FEATURES = {
  admin: {
    showAdminPanel: true,
    showUserManagement: true,
    showTeamManagement: true,
    showAnalytics: true,
    showSettings: true,
    showAllProjects: true,
    showAllTasks: true,
  },
  manager: {
    showAdminPanel: true,
    showUserManagement: false,
    showTeamManagement: true,
    showAnalytics: true,
    showSettings: false,
    showAllProjects: true,
    showAllTasks: true,
  },
  team_lead: {
    showAdminPanel: false,
    showUserManagement: false,
    showTeamManagement: true,
    showAnalytics: false,
    showSettings: false,
    showAllProjects: false,
    showAllTasks: true,
  },
  user: {
    showAdminPanel: false,
    showUserManagement: false,
    showTeamManagement: false,
    showAnalytics: false,
    showSettings: false,
    showAllProjects: false,
    showAllTasks: false,
  },
};

// Helper Functions
export const RoleUtils = {
  // Check if a role has permission for a specific action
  hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
    return ROLES[role]?.[permission] || false;
  },

  // Check if role can access a specific route
  canAccessRoute(role: UserRole, route: string): boolean {
    const allowedRoutes = ROLE_ROUTES[role] || [];
    return allowedRoutes.some(allowedRoute => 
      route.startsWith(allowedRoute)
    );
  },

  // Compare role hierarchy
  isHigherRole(role1: UserRole, role2: UserRole): boolean {
    return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
  },

  // Get all roles that are equal or lower in hierarchy
  getLowerRoles(role: UserRole): UserRole[] {
    const roleLevel = ROLE_HIERARCHY[role];
    return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter(
      r => ROLE_HIERARCHY[r] <= roleLevel
    );
  },

  // Get all roles that are higher in hierarchy
  getHigherRoles(role: UserRole): UserRole[] {
    const roleLevel = ROLE_HIERARCHY[role];
    return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter(
      r => ROLE_HIERARCHY[r] > roleLevel
    );
  },

  // Validate role
  isValidRole(role: string): role is UserRole {
    return Object.keys(ROLES).includes(role);
  },

  // Get role display name
  getDisplayName(role: UserRole): string {
    return ROLE_DISPLAY_NAMES[role] || role;
  },

  // Get role description
  getDescription(role: UserRole): string {
    return ROLE_DESCRIPTIONS[role] || '';
  },
};

// Default role for new users
export const DEFAULT_ROLE: UserRole = 'user';

// Export default roles configuration
export default {
  ROLES,
  ROLE_DISPLAY_NAMES,
  ROLE_DESCRIPTIONS,
  ROLE_HIERARCHY,
  ROLE_ROUTES,
  ROLE_FEATURES,
  RoleUtils,
  DEFAULT_ROLE,
};