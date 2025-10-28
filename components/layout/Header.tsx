import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  onBackPress?: () => void;
}

export default function Header({
  title,
  showBackButton = true,
  rightComponent,
  leftComponent,
  backgroundColor = '#ffffff',
  textColor = '#333333',
  onBackPress,
}: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback to home if can't go back
        router.replace('/(user)');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (displayName: string | null) => {
    if (!displayName) return 'U';
    return displayName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        barStyle={textColor === '#ffffff' ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.backButtonText, { color: textColor }]}>
                ←
              </Text>
            </TouchableOpacity>
          )}
          
          {leftComponent && (
            <View style={styles.leftComponent}>
              {leftComponent}
            </View>
          )}
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text 
            style={[styles.title, { color: textColor }]} 
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent ? (
            rightComponent
          ) : user ? (
            <View style={styles.userSection}>
              <TouchableOpacity 
                style={styles.userAvatar}
                onPress={handleLogout}
              >
                <Text style={styles.userInitials}>
                  {getInitials(user.displayName)}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  leftComponent: {
    marginRight: 8,
  },
  titleSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});