export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  assignedTeam: Team;
  status: 'not-started' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  projectId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  totalTasks: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'not-started' | 'ongoing' | 'done';
  assignee?: TeamMember;
  sprintId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}