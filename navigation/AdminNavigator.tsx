import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Icons (you can use react-native-vector-icons or any other icon library)
// For now, we'll use text icons
const TabIcon = ({ focused, label, icon }: { focused: boolean; label: string; icon: string }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

// Admin Screens
import AdminDashboard from '../app/(admin)/index';
import ProjectDetail from '../app/(admin)/project-detail';
import SprintDetail from '../app/(admin)/sprint-detail';
import AddProject from '../app/(admin)/add-project';

export type AdminTabParamList = {
  Dashboard: undefined;
  Projects: undefined;
  Teams: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  MainTabs: undefined;
  ProjectDetail: { id: string; title?: string };
  SprintDetail: { id: string; projectId?: string; title?: string };
  AddProject: undefined;
  TeamManagement: undefined;
  UserManagement: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

// Dashboard Tab
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={AdminDashboard} />
    </Stack.Navigator>
  );
}

// Projects Tab
function ProjectsStack() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#333333',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ProjectsMain" 
        component={AdminDashboard}
        options={{
          title: 'Projects',
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProject')}
            >
              <Text style={styles.addButtonText}>Add Project</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetail}
        options={({ route }) => ({
          title: route.params?.title || 'Project Details',
        })}
      />
      <Stack.Screen 
        name="SprintDetail" 
        component={SprintDetail}
        options={({ route }) => ({
          title: route.params?.title || 'Sprint Details',
        })}
      />
      <Stack.Screen 
        name="AddProject" 
        component={AddProject}
        options={{
          title: 'Add Project',
        }}
      />
    </Stack.Navigator>
  );
}

// Teams Tab (Placeholder)
function TeamsScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Teams Management</Text>
      <Text style={styles.placeholderSubtext}>Team management features coming soon</Text>
    </View>
  );
}

// Analytics Tab (Placeholder)
function AnalyticsScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Analytics</Text>
      <Text style={styles.placeholderSubtext}>Analytics dashboard coming soon</Text>
    </View>
  );
}

// Profile Tab (Placeholder)
function ProfileScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Profile</Text>
      <Text style={styles.placeholderSubtext}>User profile features coming soon</Text>
    </View>
  );
}

// Main Admin Tab Navigator
function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#6c757d',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Dashboard" icon="📊" />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Projects" icon="📁" />
          ),
        }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Teams" icon="👥" />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Analytics" icon="📈" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" icon="👤" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Admin Navigator
export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={AdminTabNavigator} />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetail}
        options={{
          headerShown: true,
          title: 'Project Details',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#333333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen 
        name="SprintDetail" 
        component={SprintDetail}
        options={{
          headerShown: true,
          title: 'Sprint Details',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#333333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen 
        name="AddProject" 
        component={AddProject}
        options={{
          headerShown: true,
          title: 'Add Project',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#333333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconFocused: {
    color: '#007bff',
  },
  tabLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  tabLabelFocused: {
    color: '#007bff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});