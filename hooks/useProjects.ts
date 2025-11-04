import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { Project, Sprint, Task } from '../types/project';

interface UseProjectsReturn {
  // State
  projects: Project[];
  project: Project | null;
  sprints: Sprint[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Project Actions
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  getProject: (projectId: string) => Promise<Project | null>;
  
  // Sprint Actions
  createSprint: (sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSprint: (sprintId: string, updates: Partial<Sprint>) => Promise<void>;
  deleteSprint: (sprintId: string) => Promise<void>;
  
  // Task Actions
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  refreshProjects: () => Promise<void>;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAdmin } = useAuth();

  // Listen to all projects (for admin) or user's projects
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const projectsQuery = isAdmin 
      ? query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'projects'), 
          where('assignedTeam.members', 'array-contains', { id: user.uid }),
          orderBy('createdAt', 'desc')
        );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectsData: Project[] = [];
        snapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() } as Project);
        });
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error('Projects listener error:', error);
        setError('Failed to load projects');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, isAdmin]);

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can create projects');

    try {
      setLoading(true);
      setError(null);

      const projectWithMetadata = {
        ...projectData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
      };

      const docRef = await addDoc(collection(db, 'projects'), projectWithMetadata);
      return docRef.id;
    } catch (error: any) {
      console.error('Create project error:', error);
      setError('Failed to create project');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can update projects');

    try {
      setLoading(true);
      setError(null);

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Update project error:', error);
      setError('Failed to update project');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can delete projects');

    try {
      setLoading(true);
      setError(null);

      // First, delete all tasks and sprints associated with this project
      const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const deleteTasks = tasksSnapshot.docs.map(taskDoc => 
        deleteDoc(doc(db, 'tasks', taskDoc.id))
      );

      const sprintsQuery = query(collection(db, 'sprints'), where('projectId', '==', projectId));
      const sprintsSnapshot = await getDocs(sprintsQuery);
      
      const deleteSprints = sprintsSnapshot.docs.map(sprintDoc => 
        deleteDoc(doc(db, 'sprints', sprintDoc.id))
      );

      // Wait for all tasks and sprints to be deleted
      await Promise.all([...deleteTasks, ...deleteSprints]);

      // Then delete the project
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error: any) {
      console.error('Delete project error:', error);
      setError('Failed to delete project');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (projectId: string): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);

      const projectDoc = await getDocs(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        const projectData = { id: projectDoc.id, ...projectDoc.data() } as Project;
        setProject(projectData);
        return projectData;
      }
      return null;
    } catch (error: any) {
      console.error('Get project error:', error);
      setError('Failed to load project');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  };

  // Sprint Management
  const createSprint = async (sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const sprintWithMetadata = {
        ...sprintData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
      };

      const docRef = await addDoc(collection(db, 'sprints'), sprintWithMetadata);
      return docRef.id;
    } catch (error: any) {
      console.error('Create sprint error:', error);
      setError('Failed to create sprint');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSprint = async (sprintId: string, updates: Partial<Sprint>): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Update sprint error:', error);
      setError('Failed to update sprint');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSprint = async (sprintId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      // First, delete all tasks in this sprint
      const tasksQuery = query(collection(db, 'tasks'), where('sprintId', '==', sprintId));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const deleteTasks = tasksSnapshot.docs.map(taskDoc => 
        deleteDoc(doc(db, 'tasks', taskDoc.id))
      );

      await Promise.all(deleteTasks);

      // Then delete the sprint
      await deleteDoc(doc(db, 'sprints', sprintId));
    } catch (error: any) {
      console.error('Delete sprint error:', error);
      setError('Failed to delete sprint');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Task Management
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const taskWithMetadata = {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
      };

      const docRef = await addDoc(collection(db, 'tasks'), taskWithMetadata);
      return docRef.id;
    } catch (error: any) {
      console.error('Create task error:', error);
      setError('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Update task error:', error);
      setError('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error: any) {
      console.error('Delete task error:', error);
      setError('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen to sprints for a specific project
  const listenToSprints = (projectId: string) => {
    if (!projectId) return;

    const sprintsQuery = query(
      collection(db, 'sprints'),
      where('projectId', '==', projectId),
      orderBy('startDate', 'asc')
    );

    return onSnapshot(sprintsQuery, (snapshot) => {
      const sprintsData: Sprint[] = [];
      snapshot.forEach((doc) => {
        sprintsData.push({ id: doc.id, ...doc.data() } as Sprint);
      });
      setSprints(sprintsData);
    });
  };

  // Listen to tasks for a specific project or sprint
  const listenToTasks = (filters: { projectId?: string; sprintId?: string }) => {
    let tasksQuery = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));

    if (filters.projectId) {
      tasksQuery = query(tasksQuery, where('projectId', '==', filters.projectId));
    }
    if (filters.sprintId) {
      tasksQuery = query(tasksQuery, where('sprintId', '==', filters.sprintId));
    }

    return onSnapshot(tasksQuery, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    });
  };

  const clearError = () => setError(null);

  const refreshProjects = async () => {
    // This would manually refresh projects if needed
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return {
    // State
    projects,
    project,
    sprints,
    tasks,
    loading,
    error,
    
    // Project Actions
    createProject,
    updateProject,
    deleteProject,
    getProject,
    
    // Sprint Actions
    createSprint,
    updateSprint,
    deleteSprint,
    
    // Task Actions
    createTask,
    updateTask,
    deleteTask,
    
    // Utility
    clearError,
    refreshProjects,
    listenToSprints,
    listenToTasks,
  };
}