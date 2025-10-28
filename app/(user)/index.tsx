import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../hooks/useAuth';
import Header from '../../../components/layout/Header';
import TaskCard from '../../../components/dashboard/TaskCard';
import { Task } from '../../../types/task';
import { Project } from '../../../types/project';

export default function UserDashboard() {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Fetch tasks assigned to current user
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('assignee.id', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const tasksUnsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setAssignedTasks(tasksData);
      setLoading(false);
    });

    // Fetch projects where user is a team member
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );

    const projectsUnsubscribe = onSnapshot(projectsQuery, (querySnapshot) => {
      const projectsData: Project[] = [];
      querySnapshot.forEach((doc) => {
        const project = { id: doc.id, ...doc.data() } as Project;
        // Check if user is in the assigned team
        if (project.assignedTeam?.members?.some(member => member.id === user.uid)) {
          projectsData.push(project);
        }
      });
      setRecentProjects(projectsData);
    });

    return () => {
      tasksUnsubscribe();
      projectsUnsubscribe();
    };
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      // In a real app, you would update this in Firebase
      // For now, we'll update locally
      setAssignedTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      Alert.alert('Success', `Task status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleAssigneePress = (assignee: any) => {
    Alert.alert('Team Member', assignee.name);
  };

  const handleViewAllTasks = () => {
    router.push('/(user)/tasks');
  };

  const handleProjectPress = (projectId: string) => {
    Alert.alert('Project Details', `View project ${projectId}`);
    // In a real app, navigate to project details
    // router.push(`/(user)/project-detail?id=${projectId}`);
  };

  const getTaskStats = () => {
    const total = assignedTasks.length;
    const completed = assignedTasks.filter(task => task.status === 'done').length;
    const ongoing = assignedTasks.filter(task => task.status === 'ongoing').length;
    const todo = assignedTasks.filter(task => task.status === 'not-started').length;

    return { total, completed, ongoing, todo };
  };

  const taskStats = getTaskStats();

  return (
    <View style={styles.container}>
      <Header 
        title="My Dashboard" 
        showBackButton={false}
        rightComponent={
          <TouchableOpacity onPress={handleViewAllTasks}>
            <Text style={styles.viewAllButton}>View All Tasks</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Here's your work overview
          </Text>
        </View>

        {/* Task Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Task Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.totalCard]}>
              <Text style={styles.statNumber}>{taskStats.total}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={[styles.statCard, styles.completedCard]}>
              <Text style={styles.statNumber}>{taskStats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={[styles.statCard, styles.ongoingCard]}>
              <Text style={styles.statNumber}>{taskStats.ongoing}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={[styles.statCard, styles.todoCard]}>
              <Text style={styles.statNumber}>{taskStats.todo}</Text>
              <Text style={styles.statLabel}>To Do</Text>
            </View>
          </View>
        </View>

        {/* Assigned Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Tasks</Text>
            <Text style={styles.taskCount}>({assignedTasks.length})</Text>
          </View>
          
          {assignedTasks.length > 0 ? (
            assignedTasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onAssigneePress={handleAssigneePress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks assigned</Text>
              <Text style={styles.emptyStateSubText}>
                You don't have any tasks assigned yet
              </Text>
            </View>
          )}

          {assignedTasks.length > 5 && (
            <TouchableOpacity style={styles.viewAllButtonContainer} onPress={handleViewAllTasks}>
              <Text style={styles.viewAllButtonText}>
                View all {assignedTasks.length} tasks
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Projects</Text>
            <Text style={styles.taskCount}>({recentProjects.length})</Text>
          </View>
          
          {recentProjects.length > 0 ? (
            recentProjects.slice(0, 3).map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => handleProjectPress(project.id)}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                    <Text style={styles.statusText}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
                {project.description && (
                  <Text style={styles.projectDescription} numberOfLines={2}>
                    {project.description}
                  </Text>
                )}
                <Text style={styles.projectTeam}>
                  Team: {project.assignedTeam?.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No projects assigned</Text>
              <Text style={styles.emptyStateSubText}>
                You're not assigned to any projects yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return '#28a745';
    case 'ongoing':
      return '#ffc107';
    case 'not-started':
      return '#6c757d';
    default:
      return '#6c757d';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  totalCard: {
    backgroundColor: '#e7f3ff',
  },
  completedCard: {
    backgroundColor: '#d4edda',
  },
  ongoingCard: {
    backgroundColor: '#fff3cd',
  },
  todoCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskCount: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  viewAllButtonContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    marginTop: 8,
  },
  viewAllButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 18,
  },
  projectTeam: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '500',
  },
  viewAllButton: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 14,
  },
});