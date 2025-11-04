import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { View, Text, ActivityIndicator } from 'react-native';

// Import screens
import Login from './app/(auth)/login';
import Register from './app/(auth)/register';
import AdminLogin from './app/(auth)/admin-login';
import AdminDashboard from './app/(admin)/index';
import UserDashboard from './app/(user)/index';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="AdminLogin" component={AdminLogin} />
          </>
        ) : userProfile?.role === 'admin' ? (
          // Admin screens
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          // User screens
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}