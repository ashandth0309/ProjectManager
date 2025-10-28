import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  role: 'user' | 'admin' | 'both';
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    route: '/(user)',
    role: 'both',
  },
  {
    id: 'tasks',
    label: 'My Tasks',
    icon: '✅',
    route: '/(user)/tasks',
    role: 'user',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '📁',
    route: '/(admin)',
    role: 'admin',
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: '👥',
    route: '/(admin)/teams',
    role: 'admin',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📈',
    route: '/(admin)/reports',
    role: 'admin',
  },
];

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserRole = () => {
    // In a real app, you'd get this from user data
    // For now, we'll check the current route to determine role
    return pathname.includes('(admin)') ? 'admin' : 'user';
  };

  const currentRole = getUserRole();
  const filteredMenuItems = menuItems.filter(
    item => item.role === 'both' || item.role === currentRole
  );

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + '/');
  };

  return (
    <>
      {/* Backdrop */}
      {visible && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>InternBridge</Text>
          <Text style={styles.roleBadge}>
            {currentRole === 'admin' ? 'Administrator' : 'Team Member'}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>
              {user?.displayName
                ? user.displayName
                    .split(' ')
                    .map(part => part[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Navigation</Text>
            {filteredMenuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  isActiveRoute(item.route) && styles.menuItemActive,
                ]}
                onPress={() => handleMenuItemPress(item.route)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuLabel,
                    isActiveRoute(item.route) && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Sections can be added here */}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 320,
    backgroundColor: 'white',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  roleBadge: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
  },
  menuScroll: {
    flex: 1,
  },
  menuSection: {
    paddingVertical: 16,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    backgroundColor: '#e7f3ff',
    borderRightWidth: 3,
    borderRightColor: '#007bff',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#007bff',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
  },
});