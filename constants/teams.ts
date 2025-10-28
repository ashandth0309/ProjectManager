import { Team, TeamMember } from '../types/team';

// Team Types
export type TeamStatus = 'active' | 'inactive' | 'archived';
export type TeamRole = 'lead' | 'developer' | 'designer' | 'tester' | 'analyst';

// Team Role Display Names
export const TEAM_ROLE_DISPLAY_NAMES: Record<TeamRole, string> = {
  lead: 'Team Lead',
  developer: 'Developer',
  designer: 'Designer',
  tester: 'Quality Assurance',
  analyst: 'Business Analyst',
};

// Team Role Descriptions
export const TEAM_ROLE_DESCRIPTIONS: Record<TeamRole, string> = {
  lead: 'Responsible for team coordination, task assignment, and project delivery.',
  developer: 'Develops and maintains software features and functionality.',
  designer: 'Creates user interfaces, user experiences, and visual designs.',
  tester: 'Ensures software quality through testing and quality assurance processes.',
  analyst: 'Analyzes business requirements and translates them into technical specifications.',
};

// Predefined Teams Data
export const PREDEFINED_TEAMS: Team[] = [
  {
    id: 'team-ashandth',
    name: 'Ashandth\'s Team',
    description: 'Frontend development team specializing in React Native and mobile applications.',
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: 'user-ashandth',
        name: 'Ashandth Uthayashankar',
        email: 'ashandth@internbridge.com',
        role: 'lead',
        teamId: 'team-ashandth',
        avatar: null,
      },
      {
        id: 'user-sobiya',
        name: 'Sobiya Khan',
        email: 'sobiya@internbridge.com',
        role: 'developer',
        teamId: 'team-ashandth',
        avatar: null,
      },
      {
        id: 'user-gelli',
        name: 'Gelli Rani',
        email: 'gelli@internbridge.com',
        role: 'designer',
        teamId: 'team-ashandth',
        avatar: null,
      },
      {
        id: 'user-aathif',
        name: 'Aathif Mohamed',
        email: 'aathif@internbridge.com',
        role: 'tester',
        teamId: 'team-ashandth',
        avatar: null,
      },
    ],
  },
  {
    id: 'team-madhuka',
    name: 'Madhuka\'s Team',
    description: 'Backend development team specializing in Node.js, Firebase, and cloud services.',
    status: 'active',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: 'user-madhuka',
        name: 'Madhuka Dilshan',
        email: 'madhuka@internbridge.com',
        role: 'lead',
        teamId: 'team-madhuka',
        avatar: null,
      },
      {
        id: 'user-nikitha',
        name: 'Nikitha Patel',
        email: 'nikitha@internbridge.com',
        role: 'developer',
        teamId: 'team-madhuka',
        avatar: null,
      },
      {
        id: 'user-ashen',
        name: 'Ashen Perera',
        email: 'ashen@internbridge.com',
        role: 'developer',
        teamId: 'team-madhuka',
        avatar: null,
      },
      {
        id: 'user-nethasa',
        name: 'Nethasa Fernando',
        email: 'nethasa@internbridge.com',
        role: 'designer',
        teamId: 'team-madhuka',
        avatar: null,
      },
      {
        id: 'user-naduni',
        name: 'Naduni Silva',
        email: 'naduni@internbridge.com',
        role: 'tester',
        teamId: 'team-madhuka',
        avatar: null,
      },
    ],
  },
];

// Available Team Members for Assignment
export const AVAILABLE_TEAM_MEMBERS: TeamMember[] = [
  // From Ashandth's Team
  {
    id: 'user-ashandth',
    name: 'Ashandth Uthayashankar',
    email: 'ashandth@internbridge.com',
    role: 'lead',
    teamId: 'team-ashandth',
    avatar: null,
  },
  {
    id: 'user-sobiya',
    name: 'Sobiya Khan',
    email: 'sobiya@internbridge.com',
    role: 'developer',
    teamId: 'team-ashandth',
    avatar: null,
  },
  {
    id: 'user-gelli',
    name: 'Gelli Rani',
    email: 'gelli@internbridge.com',
    role: 'designer',
    teamId: 'team-ashandth',
    avatar: null,
  },
  {
    id: 'user-aathif',
    name: 'Aathif Mohamed',
    email: 'aathif@internbridge.com',
    role: 'tester',
    teamId: 'team-ashandth',
    avatar: null,
  },
  
  // From Madhuka's Team
  {
    id: 'user-madhuka',
    name: 'Madhuka Dilshan',
    email: 'madhuka@internbridge.com',
    role: 'lead',
    teamId: 'team-madhuka',
    avatar: null,
  },
  {
    id: 'user-nikitha',
    name: 'Nikitha Patel',
    email: 'nikitha@internbridge.com',
    role: 'developer',
    teamId: 'team-madhuka',
    avatar: null,
  },
  {
    id: 'user-ashen',
    name: 'Ashen Perera',
    email: 'ashen@internbridge.com',
    role: 'developer',
    teamId: 'team-madhuka',
    avatar: null,
  },
  {
    id: 'user-nethasa',
    name: 'Nethasa Fernando',
    email: 'nethasa@internbridge.com',
    role: 'designer',
    teamId: 'team-madhuka',
    avatar: null,
  },
  {
    id: 'user-naduni',
    name: 'Naduni Silva',
    email: 'naduni@internbridge.com',
    role: 'tester',
    teamId: 'team-madhuka',
    avatar: null,
  },
];

// Team Status Options
export const TEAM_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: '#4caf50' },
  { value: 'inactive', label: 'Inactive', color: '#ff9800' },
  { value: 'archived', label: 'Archived', color: '#9e9e9e' },
];

// Team Role Options
export const TEAM_ROLE_OPTIONS = [
  { value: 'lead', label: 'Team Lead', color: '#2196f3' },
  { value: 'developer', label: 'Developer', color: '#4caf50' },
  { value: 'designer', label: 'Designer', color: '#9c27b0' },
  { value: 'tester', label: 'Quality Assurance', color: '#ff9800' },
  { value: 'analyst', label: 'Business Analyst', color: '#607d8b' },
];

// Team Performance Metrics
export const TEAM_PERFORMANCE_METRICS = {
  completionRate: {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 50,
  },
  velocity: {
    excellent: 20,
    good: 15,
    average: 10,
    poor: 5,
  },
  quality: {
    excellent: 95,
    good: 85,
    average: 75,
    poor: 65,
  },
};

// Team Capacity Limits
export const TEAM_CAPACITY = {
  minMembers: 1,
  maxMembers: 10,
  optimalSize: 4,
};

// Team Colors for Visualization
export const TEAM_COLORS = {
  'team-ashandth': '#2196f3', // Blue
  'team-madhuka': '#ff9800',  // Orange
  default: '#9e9e9e',         // Gray
};

// Team Helper Functions
export const TeamUtils = {
  // Get team by ID
  getTeamById(teams: Team[], teamId: string): Team | undefined {
    return teams.find(team => team.id === teamId);
  },

  // Get team member by ID
  getTeamMember(teams: Team[], memberId: string): TeamMember | undefined {
    for (const team of teams) {
      const member = team.members.find(m => m.id === memberId);
      if (member) return member;
    }
    return undefined;
  },

  // Get team members by team ID
  getTeamMembers(teams: Team[], teamId: string): TeamMember[] {
    const team = teams.find(t => t.id === teamId);
    return team ? team.members : [];
  },

  // Check if user is in a team
  isUserInTeam(teams: Team[], userId: string, teamId: string): boolean {
    const team = teams.find(t => t.id === teamId);
    return team ? team.members.some(m => m.id === userId) : false;
  },

  // Get teams for a user
  getUserTeams(teams: Team[], userId: string): Team[] {
    return teams.filter(team => 
      team.members.some(member => member.id === userId)
    );
  },

  // Get team color
  getTeamColor(teamId: string): string {
    return TEAM_COLORS[teamId as keyof typeof TEAM_COLORS] || TEAM_COLORS.default;
  },

  // Get team role display name
  getRoleDisplayName(role: TeamRole): string {
    return TEAM_ROLE_DISPLAY_NAMES[role] || role;
  },

  // Get team status display info
  getStatusDisplay(status: TeamStatus): { label: string; color: string } {
    const statusOption = TEAM_STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption || { label: status, color: '#9e9e9e' };
  },

  // Calculate team performance score
  calculatePerformanceScore(team: Team, metrics: any): number {
    // This would calculate based on actual metrics
    // For now, return a placeholder score
    return 85;
  },

  // Check if team can accept more members
  canAddMember(team: Team): boolean {
    return team.members.length < TEAM_CAPACITY.maxMembers;
  },

  // Validate team data
  isValidTeam(team: Partial<Team>): boolean {
    return !!(team.name && team.name.trim() && team.members && team.members.length > 0);
  },

  // Generate team initials
  getTeamInitials(teamName: string): string {
    return teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  },

  // Get available roles for team member assignment
  getAvailableRoles(): Array<{ value: TeamRole; label: string }> {
    return TEAM_ROLE_OPTIONS;
  },
};

// Team Default Values
export const TEAM_DEFAULTS = {
  name: 'New Team',
  description: '',
  status: 'active' as TeamStatus,
  members: [],
};

// Export default teams configuration
export default {
  PREDEFINED_TEAMS,
  AVAILABLE_TEAM_MEMBERS,
  TEAM_STATUS_OPTIONS,
  TEAM_ROLE_OPTIONS,
  TEAM_PERFORMANCE_METRICS,
  TEAM_CAPACITY,
  TEAM_COLORS,
  TEAM_ROLE_DISPLAY_NAMES,
  TEAM_ROLE_DESCRIPTIONS,
  TeamUtils,
  TEAM_DEFAULTS,
};