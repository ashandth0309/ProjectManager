import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import ProjectCard from '../../components/dashboard/ProjectCard';
import Header from '../../components/layout/Header';
import { Project } from '../../types/project';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData: Project[] = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddProject = () => {
  console.log('Add Project button pressed');
  Alert.alert('Button Test', 'Add Project button works!'); // Test if button works
  router.push('/(admin)/add-project');
};

const handleProjectPress = (projectId: string) => {
  console.log('Project pressed:', projectId);
  Alert.alert('Button Test', `Project ${projectId} pressed!`);
  router.push(`/(admin)/project-detail?id=${projectId}`);
};

const handleSummaryPress = () => {
  console.log('Summary button pressed');
  Alert.alert('Button Test', 'Summary button works!');
  router.push('/(admin)/summary');
};

  return (
    <View style={styles.container}>
      <Header 
        title="Admin Dashboard" 
        showBackButton={false}
        rightComponent={
          <TouchableOpacity onPress={handleSummaryPress}>
            <Text style={styles.summaryButton}>Summary</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Projects</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
            <Text style={styles.addButtonText}>+ Add Project</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.projectsContainer}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => handleProjectPress(project.id)}
            />
          ))}
          
          {projects.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No projects yet</Text>
              <Text style={styles.emptyStateSubText}>
                Click "Add Project" to create your first project
              </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  projectsContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  summaryButton: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 16,
  },
});