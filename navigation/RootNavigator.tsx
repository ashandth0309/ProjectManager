import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View, Text } from 'react-native';

// Auth Screens
import Login from '../app/(auth)/login';
import Register from '../app/(auth)/register';
import AdminLogin from '../app/(auth)/admin-login';

// Admin Screens
import AdminDashboard from '../app/(admin)/index';
import ProjectDetail from '../app/(admin)/project-detail';
import SprintDetail from '../app/(admin)/sprint-detail';
import AddProject from '../app/(admin)/add-project';

// User Screens
import UserDashboard from '../app/(user)/index';
import UserTasks from '../app/(user)/tasks';

export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;
  AdminLogin: undefined;
  
  // Admin Stack
  AdminDashboard: undefined;
  ProjectDetail: { id: string; title?: string };
  SprintDetail: { id: string; projectId?: string; title?: string };
  AddProject: undefined;
  
  // User Stack
  UserDashboard: undefined;
  UserTasks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, userProfile, loading, setUser } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 16, color: '#6c757d' }}>Loading...</Text>
      </View>
    );
  }

  const isAdmin = userProfile?.role === 'admin';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#f8f9fa' },
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen 
              name="Login" 
              component={Login}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={Register}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="AdminLogin" 
              component={AdminLogin}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack.Group>
        ) : isAdmin ? (
          // Admin Stack
          <Stack.Group>
            <Stack.Screen 
              name="AdminDashboard" 
              component={AdminDashboard}
              options={{
                animation: 'fade',
              }}
            />
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
          </Stack.Group>
        ) : (
          // User Stack
          <Stack.Group>
            <Stack.Screen 
              name="UserDashboard" 
              component={UserDashboard}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen 
              name="UserTasks" 
              component={UserTasks}
              options={{
                headerShown: true,
                title: 'My Tasks',
                headerStyle: { backgroundColor: '#ffffff' },
                headerTintColor: '#333333',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Custom hook for navigation
export function useRootNavigation() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return navigation;
}