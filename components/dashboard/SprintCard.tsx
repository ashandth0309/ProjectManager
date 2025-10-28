import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Sprint } from '../../types/sprint';

interface SprintCardProps {
  sprint: Sprint;
  onPress: () => void;
}

export default function SprintCard({ sprint, onPress }: SprintCardProps) {
  const getStatusColor = (status: string) => {
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
  };

  const progress = sprint.totalTasks > 0 
    ? (sprint.completedTasks / sprint.totalTasks) * 100 
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.sprintName}>{sprint.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sprint.status) }]}>
          <Text style={styles.statusText}>
            {sprint.status.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.dates}>
        <Text style={styles.dateText}>
          {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%`, backgroundColor: getStatusColor(sprint.status) }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {sprint.completedTasks}/{sprint.totalTasks} tasks
        </Text>
      </View>
      
      {sprint.description && (
        <Text style={styles.description} numberOfLines={2}>
          {sprint.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sprintName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  dates: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#6c757d',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 18,
  },
});