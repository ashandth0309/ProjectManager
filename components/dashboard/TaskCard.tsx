import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onAssigneePress: (assignee: any) => void;
}

export default function TaskCard({ task, onStatusChange, onAssigneePress }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#28a745';
      case 'ongoing':
        return '#ffc107';
      case 'not-started':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.taskName}>{task.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={styles.statusText}>
            {task.status.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      {task.description && (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.assigneeContainer}>
          {task.assignee ? (
            <TouchableOpacity 
              style={styles.assigneeBadge}
              onPress={() => onAssigneePress(task.assignee)}
            >
              <Text style={styles.assigneeInitials}>
                {getInitials(task.assignee.name)}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noAssignee}>Unassigned</Text>
          )}
        </View>
        
        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.status === 'not-started' && styles.statusButtonActive
            ]}
            onPress={() => onStatusChange(task.id, 'not-started')}
          >
            <Text style={styles.statusButtonText}>To Do</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.status === 'ongoing' && styles.statusButtonActive
            ]}
            onPress={() => onStatusChange(task.id, 'ongoing')}
          >
            <Text style={styles.statusButtonText}>Ongoing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.status === 'done' && styles.statusButtonActive
            ]}
            onPress={() => onStatusChange(task.id, 'done')}
          >
            <Text style={styles.statusButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assigneeInitials: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noAssignee: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  statusButtons: {
    flexDirection: 'row',
  },
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  statusButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
});