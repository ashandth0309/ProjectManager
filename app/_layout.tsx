import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { View, Text, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { user, setUser, loading, setLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  useEffect(() => {
    if (loading || !segments?.length) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from auth pages if authenticated
      // For now, redirect to user dashboard
      router.replace('/(user)');
    }
  }, [user, segments, loading, router]);

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