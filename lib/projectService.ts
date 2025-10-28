import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  Timestamp,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, Sprint, Task } from '../types/project';
import { TeamMember } from '../types/team';

// Project service
class ProjectService {
  // Project operations

  // Create a new project
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const projectWithMetadata = {
        ...projectData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'projects'), projectWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Create project error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get project by ID
  async getProject(projectId: string): Promise<Project | null> {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        return { id: projectDoc.id, ...projectDoc.data() } as Project;
      }
      return null;
    } catch (error) {
      console.error('Get project error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Update project
  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Update project error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Delete project and all related data (sprints, tasks)
  async deleteProject(projectId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete all tasks in the project
      const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
      const tasksSnapshot = await getDocs(tasksQuery);
      tasksSnapshot.docs.forEach(taskDoc => {
        batch.delete(doc(db, 'tasks', taskDoc.id));
      });

      // Delete all sprints in the project
      const sprintsQuery = query(collection(db, 'sprints'), where('projectId', '==', projectId));
      const sprintsSnapshot = await getDocs(sprintsQuery);
      sprintsSnapshot.docs.forEach(sprintDoc => {
        batch.delete(doc(db, 'sprints', sprintDoc.id));
      });

      // Delete the project
      batch.delete(doc(db, 'projects', projectId));

      await batch.commit();
    } catch (error) {
      console.error('Delete project error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(projectsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      console.error('Get all projects error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get projects by team
  async getProjectsByTeam(teamId: string): Promise<Project[]> {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('assignedTeam.id', '==', teamId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(projectsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      console.error('Get projects by team error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Sprint operations

  // Create a new sprint
  async createSprint(sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const sprintWithMetadata = {
        ...sprintData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'sprints'), sprintWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Create sprint error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get sprint by ID
  async getSprint(sprintId: string): Promise<Sprint | null> {
    try {
      const sprintDoc = await getDoc(doc(db, 'sprints', sprintId));
      if (sprintDoc.exists()) {
        return { id: sprintDoc.id, ...sprintDoc.data() } as Sprint;
      }
      return null;
    } catch (error) {
      console.error('Get sprint error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Update sprint
  async updateSprint(sprintId: string, updates: Partial<Sprint>): Promise<void> {
    try {
      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Update sprint error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Delete sprint and its tasks
  async deleteSprint(sprintId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete all tasks in the sprint
      const tasksQuery = query(collection(db, 'tasks'), where('sprintId', '==', sprintId));
      const tasksSnapshot = await getDocs(tasksQuery);
      tasksSnapshot.docs.forEach(taskDoc => {
        batch.delete(doc(db, 'tasks', taskDoc.id));
      });

      // Delete the sprint
      batch.delete(doc(db, 'sprints', sprintId));

      await batch.commit();
    } catch (error) {
      console.error('Delete sprint error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get sprints by project
  async getSprintsByProject(projectId: string): Promise<Sprint[]> {
    try {
      const sprintsQuery = query(
        collection(db, 'sprints'),
        where('projectId', '==', projectId),
        orderBy('startDate', 'asc')
      );
      const snapshot = await getDocs(sprintsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sprint));
    } catch (error) {
      console.error('Get sprints by project error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Task operations

  // Create a new task
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const taskWithMetadata = {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'tasks'), taskWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Create task error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get task by ID
  async getTask(taskId: string): Promise<Task | null> {
    try {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      if (taskDoc.exists()) {
        return { id: taskDoc.id, ...taskDoc.data() } as Task;
      }
      return null;
    } catch (error) {
      console.error('Get task error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Update task
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Update task error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Delete task
  async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Delete task error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get tasks by project
  async getTasksByProject(projectId: string): Promise<Task[]> {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    } catch (error) {
      console.error('Get tasks by project error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get tasks by sprint
  async getTasksBySprint(sprintId: string): Promise<Task[]> {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('sprintId', '==', sprintId),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    } catch (error) {
      console.error('Get tasks by sprint error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get tasks by assignee
  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('assignee.id', '==', assigneeId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    } catch (error) {
      console.error('Get tasks by assignee error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Assign task to team member
  async assignTask(taskId: string, assignee: TeamMember): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        assignee,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Assign task error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Update task status
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Update task status error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Real-time listeners

  // Listen to projects changes
  listenToProjects(callback: (projects: Project[]) => void): Unsubscribe {
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(projectsQuery, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      callback(projects);
    }, (error) => {
      console.error('Projects listener error:', error);
    });
  }

  // Listen to project changes
  listenToProject(projectId: string, callback: (project: Project | null) => void): Unsubscribe {
    const projectRef = doc(db, 'projects', projectId);
    
    return onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Project);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Project listener error:', error);
    });
  }

  // Listen to sprints changes for a project
  listenToSprints(projectId: string, callback: (sprints: Sprint[]) => void): Unsubscribe {
    const sprintsQuery = query(
      collection(db, 'sprints'),
      where('projectId', '==', projectId),
      orderBy('startDate', 'asc')
    );
    
    return onSnapshot(sprintsQuery, (snapshot) => {
      const sprints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sprint));
      callback(sprints);
    }, (error) => {
      console.error('Sprints listener error:', error);
    });
  }

  // Listen to tasks changes with filters
  listenToTasks(filters: { projectId?: string; sprintId?: string; assigneeId?: string }, callback: (tasks: Task[]) => void): Unsubscribe {
    let tasksQuery = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));

    if (filters.projectId) {
      tasksQuery = query(tasksQuery, where('projectId', '==', filters.projectId));
    }
    if (filters.sprintId) {
      tasksQuery = query(tasksQuery, where('sprintId', '==', filters.sprintId));
    }
    if (filters.assigneeId) {
      tasksQuery = query(tasksQuery, where('assignee.id', '==', filters.assigneeId));
    }
    
    return onSnapshot(tasksQuery, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      callback(tasks);
    }, (error) => {
      console.error('Tasks listener error:', error);
    });
  }

  // Analytics and reporting

  // Get project statistics
  async getProjectStats(projectId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    notStartedTasks: number;
  }> {
    try {
      const tasks = await this.getTasksByProject(projectId);
      
      return {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status === 'done').length,
        inProgressTasks: tasks.filter(task => task.status === 'ongoing').length,
        notStartedTasks: tasks.filter(task => task.status === 'not-started').length,
      };
    } catch (error) {
      console.error('Get project stats error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get user task statistics
  async getUserTaskStats(userId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  }> {
    try {
      const tasks = await this.getTasksByAssignee(userId);
      
      return {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'done').length,
        inProgress: tasks.filter(task => task.status === 'ongoing').length,
        notStarted: tasks.filter(task => task.status === 'not-started').length,
      };
    } catch (error) {
      console.error('Get user task stats error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Error handler for Firestore errors
  private handleFirestoreError(error: any): Error {
    let errorMessage = 'A database error occurred';

    switch (error.code) {
      case 'permission-denied':
        errorMessage = 'You do not have permission to perform this action';
        break;
      case 'not-found':
        errorMessage = 'The requested document was not found';
        break;
      case 'already-exists':
        errorMessage = 'A document with this ID already exists';
        break;
      case 'resource-exhausted':
        errorMessage = 'The database quota has been exceeded';
        break;
      case 'failed-precondition':
        errorMessage = 'Operation was rejected because the system is not in a required state';
        break;
      case 'aborted':
        errorMessage = 'Operation was aborted';
        break;
      case 'out-of-range':
        errorMessage = 'Operation was attempted past the valid range';
        break;
      case 'unimplemented':
        errorMessage = 'Operation is not implemented or not supported';
        break;
      case 'internal':
        errorMessage = 'Internal database error';
        break;
      case 'unavailable':
        errorMessage = 'The service is currently unavailable';
        break;
      case 'data-loss':
        errorMessage = 'Unrecoverable data loss or corruption';
        break;
      case 'unauthenticated':
        errorMessage = 'User is not authenticated';
        break;
      default:
        errorMessage = error.message || errorMessage;
        break;
    }

    return new Error(errorMessage);
  }
}

// Create and export a singleton instance
export const projectService = new ProjectService();

// Default export
export default projectService;