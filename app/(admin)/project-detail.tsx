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
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import SprintCard from '../../components/dashboard/SprintCard';
import TaskCard from '../../components/dashboard/TaskCard';
import TeamMemberPopup from '../../components/dashboard/TeamMemberPopup';
import { Project } from '../../types/project';
import { Sprint } from '../../types/sprint';
import { Task } from '../../types/task';
import { Team } from '../../types/team';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [teamPopupVisible, setTeamPopupVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    // Listen to project changes
    const projectUnsubscribe = onSnapshot(
      doc(db, 'projects', id as string),
      (doc) => {
        if (doc.exists()) {
          setProject({ id: doc.id, ...doc.data() } as Project);
        }
      },
      (error) => {
        console.error('Error fetching project:', error);
        Alert.alert('Error', 'Failed to load project details');
      }
    );

    // Listen to sprints for this project
    const sprintsQuery = query(
      collection(db, 'sprints'),
      where('projectId', '==', id),
      orderBy('startDate', 'asc')
    );

    const sprintsUnsubscribe = onSnapshot(sprintsQuery, (querySnapshot) => {
      const sprintsData: Sprint[] = [];
      querySnapshot.forEach((doc) => {
        sprintsData.push({ id: doc.id, ...doc.data() } as Sprint);
      });
      setSprints(sprintsData);
    });

    // Listen to tasks for this project
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('projectId', '==', id),
      orderBy('createdAt', 'desc')
    );

    const tasksUnsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    });

    return () => {
      projectUnsubscribe();
      sprintsUnsubscribe();
      tasksUnsubscribe();
    };
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSprintPress = (sprintId: string) => {
    router.push(`/(admin)/sprint-detail?id=${sprintId}&projectId=${id}`);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      // Update task status in Firebase
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleAssigneePress = (assignee: any) => {
    Alert.alert('Assignee', assignee.name);
  };

  const handleTeamMorePress = () => {
    if (project?.assignedTeam) {
      setSelectedTeam(project.assignedTeam);
      setTeamPopupVisible(true);
    }
  };

  const handleAddMembers = (team: Team) => {
    setTeamPopupVisible(false);
    // Navigate to add members screen or show modal
    Alert.alert('Add Members', `Add members to ${team.name}`);
  };

  const handleAddSprint = () => {
    Alert.alert('Add Sprint', 'This will open add sprint form');
    // router.push(`/(admin)/add-sprint?projectId=${id}`);
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <Header title="Project Details" showBackButton={true} />
        <View style={styles.centered}>
          <Text>Loading project details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Project Details" showBackButton={true} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Project Header */}
        <View style={styles.projectHeader}>
          <View style={styles.projectTitleContainer}>
            <Text style={styles.projectName}>{project.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
              <Text style={styles.statusText}>
                {project.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
          
          {project.description && (
            <Text style={styles.projectDescription}>{project.description}</Text>
          )}
          
          <View style={styles.projectMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Start Date</Text>
              <Text style={styles.metaValue}>
                {new Date(project.startDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Team</Text>
              <TouchableOpacity onPress={handleTeamMorePress}>
                <Text style={[styles.metaValue, styles.teamLink]}>
                  {project.assignedTeam?.name || 'No team assigned'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sprints Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sprints</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddSprint}>
              <Text style={styles.addButtonText}>+ Add Sprint</Text>
            </TouchableOpacity>
          </View>
          
          {sprints.length > 0 ? (
            sprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onPress={() => handleSprintPress(sprint.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No sprints yet</Text>
              <Text style={styles.emptyStateSubText}>
                Add a sprint to start organizing tasks
              </Text>
            </View>
          )}
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Tasks</Text>
            <Text style={styles.taskCount}>({tasks.length})</Text>
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
              <Text style={styles.emptyStateText}>No tasks yet</Text>
              <Text style={styles.emptyStateSubText}>
                Tasks will appear here when added to sprints
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Team Member Popup */}
      <TeamMemberPopup
        visible={teamPopupVisible}
        team={selectedTeam}
        onClose={() => setTeamPopupVisible(false)}
        onAddMembers={handleAddMembers}
      />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectHeader: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  projectTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 24,
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
  projectDescription: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
    marginBottom: 16,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  teamLink: {
    color: '#007bff',
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
  taskCount: {
    fontSize: 14,
    color: '#6c757d',
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