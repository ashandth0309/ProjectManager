import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, Text, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    console.log('Auth State:', { user: user?.email, userProfile, inAuthGroup, segments });

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      console.log('Redirecting to login');
      router.replace('/(auth)/login');
    } else if (user) {
      // Check user role and redirect accordingly
      if (userProfile?.role === 'admin') {
        if (segments[0] !== '(admin)') {
          console.log('Redirecting to admin dashboard');
          router.replace('/(admin)');
        }
      } else {
        if (segments[0] !== '(user)') {
          console.log('Redirecting to user dashboard');
          router.replace('/(user)');
        }
      }
    }
  }, [user, userProfile, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 16, color: '#6c757d' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      {/* Auth Group */}
      <Stack.Screen 
        name="(auth)" 
        options={{ 
          headerShown: false,
          animation: 'fade'
        }} 
      />
      
      {/* Admin Group */}
      <Stack.Screen 
        name="(admin)" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />
      
      {/* User Group */}
      <Stack.Screen 
        name="(user)" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />
    </Stack>
  );
}