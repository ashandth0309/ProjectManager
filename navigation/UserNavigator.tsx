import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

// Icons (using text icons for simplicity)
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

// User Screens
import UserDashboard from '../app/(user)/index';
import UserTasks from '../app/(user)/tasks';

export type UserTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Projects: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  MainTabs: undefined;
  TaskDetail: { id: string; title?: string };
  ProjectDetail: { id: string; title?: string };
  Settings: undefined;
};

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createNativeStackNavigator<UserStackParamList>();

// Dashboard Tab
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={UserDashboard} />
    </Stack.Navigator>
  );
}

// Tasks Tab
function TasksStack() {
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
        name="TasksMain" 
        component={UserTasks}
        options={{
          title: 'My Tasks',
        }}
      />
    </Stack.Navigator>
  );
}

// Projects Tab (Placeholder)
function ProjectsScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>My Projects</Text>
      <Text style={styles.placeholderSubtext}>
        View and manage projects you're assigned to
      </Text>
    </View>
  );
}

// Profile Tab (Placeholder)
function ProfileScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>My Profile</Text>
      <Text style={styles.placeholderSubtext}>
        Manage your profile and settings
      </Text>
    </View>
  );
}

// Main User Tab Navigator
function UserTabNavigator() {
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
            <TabIcon focused={focused} label="Dashboard" icon="🏠" />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Tasks" icon="✅" />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Projects" icon="📁" />
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

// Main User Navigator
export default function UserNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={UserTabNavigator} />
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