import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface FooterProps {
  showNavigation?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export default function Footer({ 
  showNavigation = false, 
  backgroundColor = '#f8f9fa',
  textColor = '#6c757d'
}: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentYear = new Date().getFullYear();

  const navigationItems = [
    { id: 'home', label: 'Home', route: '/(user)' },
    { id: 'tasks', label: 'Tasks', route: '/(user)/tasks' },
    { id: 'projects', label: 'Projects', route: '/(admin)' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + '/');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Main Footer Content */}
      <View style={styles.mainContent}>
        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.appName, { color: textColor }]}>
            InternBridge
          </Text>
          <Text style={[styles.appDescription, { color: textColor }]}>
            Streamlining project management and team collaboration for modern teams.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              onPress={() => handleExternalLink('https://twitter.com')}
            >
              <Text style={[styles.socialLink, { color: textColor }]}>
                Twitter
              </Text>
            </TouchableOpacity>
            <Text style={[styles.separator, { color: textColor }]}>•</Text>
            <TouchableOpacity
              onPress={() => handleExternalLink('https://linkedin.com')}
            >
              <Text style={[styles.socialLink, { color: textColor }]}>
                LinkedIn
              </Text>
            </TouchableOpacity>
            <Text style={[styles.separator, { color: textColor }]}>•</Text>
            <TouchableOpacity
              onPress={() => handleExternalLink('https://github.com')}
            >
              <Text style={[styles.socialLink, { color: textColor }]}>
                GitHub
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Quick Links
          </Text>
          <TouchableOpacity onPress={() => handleExternalLink('mailto:support@internbridge.com')}>
            <Text style={[styles.link, { color: textColor }]}>
              Support
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleExternalLink('https://internbridge.com/docs')}>
            <Text style={[styles.link, { color: textColor }]}>
              Documentation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleExternalLink('https://internbridge.com/help')}>
            <Text style={[styles.link, { color: textColor }]}>
              Help Center
            </Text>
          </TouchableOpacity>
        </View>

        {/* Company */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Company
          </Text>
          <TouchableOpacity onPress={() => handleExternalLink('https://internbridge.com/about')}>
            <Text style={[styles.link, { color: textColor }]}>
              About Us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleExternalLink('https://internbridge.com/contact')}>
            <Text style={[styles.link, { color: textColor }]}>
              Contact
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleExternalLink('https://internbridge.com/privacy')}>
            <Text style={[styles.link, { color: textColor }]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation (for mobile) */}
      {showNavigation && Platform.OS !== 'web' && (
        <View style={styles.bottomNavigation}>
          {navigationItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isActiveRoute(item.route) && styles.navItemActive,
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <Text
                style={[
                  styles.navLabel,
                  isActiveRoute(item.route) && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Copyright */}
      <View style={styles.copyright}>
        <Text style={[styles.copyrightText, { color: textColor }]}>
          © {currentYear} InternBridge. All rights reserved.
        </Text>
        <Text style={[styles.versionText, { color: textColor }]}>
          v1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  section: {
    flex: 1,
    minWidth: 150,
    marginBottom: 20,
    marginRight: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  bottomNavigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 16,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: '#007bff',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  navLabelActive: {
    color: 'white',
  },
  copyright: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  copyrightText: {
    fontSize: 14,
  },
  versionText: {
    fontSize: 12,
  },
});