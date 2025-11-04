import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot, collection, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import TaskCard from '../../components/dashboard/TaskCard';
import { Sprint } from '../../types/sprint';
import { Task } from '../../types/task';
import { Project } from '../../types/project';

export default function SprintDetail() {
  const { id, projectId } = useLocalSearchParams();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    // Listen to sprint changes
    const sprintUnsubscribe = onSnapshot(
      doc(db, 'sprints', id as string),
      (doc) => {
        if (doc.exists()) {
          setSprint({ id: doc.id, ...doc.data() } as Sprint);
        }
      },
      (error) => {
        console.error('Error fetching sprint:', error);
        Alert.alert('Error', 'Failed to load sprint details');
      }
    );

    // Listen to project details
    if (projectId) {
      const projectUnsubscribe = onSnapshot(
        doc(db, 'projects', projectId as string),
        (doc) => {
          if (doc.exists()) {
            setProject({ id: doc.id, ...doc.data() } as Project);
          }
        }
      );
    }

    // Listen to tasks for this sprint
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('sprintId', '==', id),
      orderBy('createdAt', 'asc')
    );

    const tasksUnsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    });

    return () => {
      sprintUnsubscribe();
      tasksUnsubscribe();
    };
  }, [id, projectId]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Update sprint progress if needed
      if (sprint) {
        await updateSprintProgress(sprint.id);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const updateSprintProgress = async (sprintId: string) => {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('sprintId', '==', sprintId)
      );

      const querySnapshot = await getDocs(tasksQuery);
      const totalTasks = querySnapshot.size;
      const completedTasks = querySnapshot.docs.filter(
        doc => doc.data().status === 'done'
      ).length;

      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, {
        totalTasks,
        completedTasks,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating sprint progress:', error);
    }
  };

  const handleAssigneePress = (assignee: any) => {
    Alert.alert('Assignee', assignee.name);
  };

  const handleAddTask = () => {
    Alert.alert('Add Task', 'This will open add task form');
    // router.push(`/(admin)/add-task?sprintId=${id}&projectId=${projectId}`);
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.status === 'done').length;
    return (completed / tasks.length) * 100;
  };

  if (!sprint) {
    return (
      <View style={styles.container}>
        <Header title="Sprint Details" showBackButton={true} />
        <View style={styles.centered}>
          <Text>Loading sprint details...</Text>
        </View>
      </View>
    );
  }

  const progress = calculateProgress();

  return (
    <View style={styles.container}>
      <Header title="Sprint Details" showBackButton={true} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sprint Header */}
        <View style={styles.sprintHeader}>
          <View style={styles.sprintTitleContainer}>
            <Text style={styles.sprintName}>{sprint.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sprint.status) }]}>
              <Text style={styles.statusText}>
                {sprint.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
          
          {project && (
            <Text style={styles.projectName}>Project: {project.name}</Text>
          )}
          
          {sprint.description && (
            <Text style={styles.sprintDescription}>{sprint.description}</Text>
          )}
          
          <View style={styles.sprintDates}>
            <Text style={styles.dateText}>
              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
            </Text>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress}%`,
                    backgroundColor: getStatusColor(sprint.status)
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressStats}>
              {tasks.filter(t => t.status === 'done').length} of {tasks.length} tasks completed
            </Text>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>
          
          {/* Task Status Summary */}
          <View style={styles.taskSummary}>
            <View style={styles.summaryItem}>
              <View style={[styles.statusDot, { backgroundColor: '#6c757d' }]} />
              <Text style={styles.summaryText}>
                To Do: {tasks.filter(t => t.status === 'not-started').length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.statusDot, { backgroundColor: '#ffc107' }]} />
              <Text style={styles.summaryText}>
                Ongoing: {tasks.filter(t => t.status === 'ongoing').length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
              <Text style={styles.summaryText}>
                Done: {tasks.filter(t => t.status === 'done').length}
              </Text>
            </View>
          </View>
          
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onAssigneePress={handleAssigneePress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks in this sprint</Text>
              <Text style={styles.emptyStateSubText}>
                Add tasks to start tracking work
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
    case 'in-progress':
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprintHeader: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  sprintTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sprintName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 8,
  },
  sprintDescription: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
    marginBottom: 12,
  },
  sprintDates: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#6c757d',
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  taskSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  summaryText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
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
});