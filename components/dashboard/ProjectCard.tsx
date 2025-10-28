import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Project } from '../../types/project';
import { calculateDaysSince } from '../../utils/calculateDays';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const daysSinceStart = calculateDaysSince(project.startDate);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.projectName} numberOfLines={1}>
            {project.name}
          </Text>
          <Text style={styles.startDate}>
            Started: {new Date(project.startDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.teamContainer}>
            <Text style={styles.teamName} numberOfLines={1}>
              {project.assignedTeam?.name || 'No team assigned'}
            </Text>
          </View>
          <View style={styles.daysContainer}>
            <Text style={styles.daysText}>
              {daysSinceStart} {daysSinceStart === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
      </View>
      
      {project.description && (
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  startDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  teamContainer: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
  },
  daysContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  daysText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    lineHeight: 18,
  },
});