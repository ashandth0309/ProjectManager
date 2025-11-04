import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import TaskCard from '../../components/dashboard/TaskCard';
import { Task } from '../../types/task';

export default function UserTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'ongoing' | 'done'>('all');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('assignee.id', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter]);

  const filterTasks = () => {
    let filtered = tasks;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTasks(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      // In a real app, you would update this in Firebase
      // For now, we'll update locally
      setTasks(prev => 
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

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'done').length;
    const ongoing = tasks.filter(task => task.status === 'ongoing').length;
    const todo = tasks.filter(task => task.status === 'not-started').length;

    return { total, completed, ongoing, todo };
  };

  const taskStats = getTaskStats();

  return (
    <View style={styles.container}>
      <Header title="My Tasks" showBackButton={true} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Task Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Task Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{taskStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.completed]}>{taskStats.completed}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.ongoing]}>{taskStats.ongoing}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.todo]}>{taskStats.todo}</Text>
              <Text style={styles.statLabel}>To Do</Text>
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search tasks..."
              placeholderTextColor="#999"
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  statusFilter === 'all' && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter('all')}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === 'all' && styles.filterButtonTextActive
                ]}>
                  All ({taskStats.total})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  statusFilter === 'not-started' && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter('not-started')}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === 'not-started' && styles.filterButtonTextActive
                ]}>
                  To Do ({taskStats.todo})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  statusFilter === 'ongoing' && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter('ongoing')}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === 'ongoing' && styles.filterButtonTextActive
                ]}>
                  In Progress ({taskStats.ongoing})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  statusFilter === 'done' && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter('done')}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === 'done' && styles.filterButtonTextActive
                ]}>
                  Done ({taskStats.completed})
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {statusFilter === 'all' ? 'All Tasks' : 
               statusFilter === 'not-started' ? 'To Do Tasks' :
               statusFilter === 'ongoing' ? 'In Progress Tasks' : 'Completed Tasks'}
            </Text>
            <Text style={styles.taskCount}>({filteredTasks.length})</Text>
          </View>
          
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onAssigneePress={handleAssigneePress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No tasks match your search' : 'No tasks found'}
              </Text>
              <Text style={styles.emptyStateSubText}>
                {searchQuery ? 'Try adjusting your search terms' : 
                 statusFilter !== 'all' ? 'No tasks with this status' : 'You have no tasks assigned'}
              </Text>
              
              {(searchQuery || statusFilter !== 'all') && (
                <TouchableOpacity 
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  completed: {
    color: '#28a745',
  },
  ongoing: {
    color: '#ffc107',
  },
  todo: {
    color: '#6c757d',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  filterScroll: {
    marginHorizontal: -16,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  tasksSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
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
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});