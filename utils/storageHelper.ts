import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  USER_ROLE: 'user_role',
  
  // User Preferences
  USER_PREFERENCES: 'user_preferences',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  NOTIFICATION_SETTINGS: 'notification_settings',
  
  // App Data
  RECENT_SEARCHES: 'recent_searches',
  CACHED_PROJECTS: 'cached_projects',
  CACHED_TEAMS: 'cached_teams',
  CACHED_TASKS: 'cached_tasks',
  CACHED_SPRINTS: 'cached_sprints',
  
  // App State
  LAST_SYNC_TIME: 'last_sync_time',
  APP_FIRST_LAUNCH: 'app_first_launch',
  APP_VERSION: 'app_version',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Navigation
  LAST_VISITED_SCREEN: 'last_visited_screen',
  NAVIGATION_STATE: 'navigation_state',
  
  // Forms
  DRAFT_PROJECT: 'draft_project',
  DRAFT_TASK: 'draft_task',
  DRAFT_SPRINT: 'draft_sprint',
} as const;

/**
 * Storage helper class with type safety
 */
class StorageHelper {
  /**
   * Store string value in AsyncStorage
   */
  async setString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing string for key ${key}:`, error);
      throw new Error(`Failed to store data: ${error}`);
    }
  }

  /**
   * Get string value from AsyncStorage
   */
  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting string for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Store object value in AsyncStorage
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing object for key ${key}:`, error);
      throw new Error(`Failed to store object: ${error}`);
    }
  }

  /**
   * Get object value from AsyncStorage
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error(`Error getting object for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from AsyncStorage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item for key ${key}:`, error);
      throw new Error(`Failed to remove data: ${error}`);
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }

  /**
   * Get multiple items from AsyncStorage
   */
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      
      values.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error in multiGet:', error);
      return {};
    }
  }

  /**
   * Store multiple items in AsyncStorage
   */
  async multiSet(keyValuePairs: Record<string, any>): Promise<void> {
    try {
      const pairs = Object.entries(keyValuePairs).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('Error in multiSet:', error);
      throw new Error(`Failed to store multiple items: ${error}`);
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists in AsyncStorage
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Error checking if key exists:', error);
      return false;
    }
  }

  /**
   * Merge existing object with new data
   */
  async mergeObject<T extends Record<string, any>>(
    key: string, 
    newData: Partial<T>
  ): Promise<void> {
    try {
      const existingData = await this.getObject<T>(key) || {} as T;
      const mergedData = { ...existingData, ...newData };
      await this.setObject(key, mergedData);
    } catch (error) {
      console.error(`Error merging object for key ${key}:`, error);
      throw new Error(`Failed to merge object: ${error}`);
    }
  }

  // Auth-specific methods

  /**
   * Store auth tokens
   */
  async setAuthTokens(token: string, refreshToken: string): Promise<void> {
    await this.multiSet({
      [STORAGE_KEYS.AUTH_TOKEN]: token,
      [STORAGE_KEYS.REFRESH_TOKEN]: refreshToken,
    });
  }

  /**
   * Get auth tokens
   */
  async getAuthTokens(): Promise<{ token: string | null; refreshToken: string | null }> {
    const [token, refreshToken] = await Promise.all([
      this.getString(STORAGE_KEYS.AUTH_TOKEN),
      this.getString(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
    
    return { token, refreshToken };
  }

  /**
   * Clear auth data
   */
  async clearAuthData(): Promise<void> {
    await Promise.all([
      this.remove(STORAGE_KEYS.AUTH_TOKEN),
      this.remove(STORAGE_KEYS.REFRESH_TOKEN),
      this.remove(STORAGE_KEYS.USER_ID),
      this.remove(STORAGE_KEYS.USER_ROLE),
    ]);
  }

  /**
   * Store user data
   */
  async setUserData(userId: string, role: string): Promise<void> {
    await this.multiSet({
      [STORAGE_KEYS.USER_ID]: userId,
      [STORAGE_KEYS.USER_ROLE]: role,
    });
  }

  /**
   * Get user data
   */
  async getUserData(): Promise<{ userId: string | null; role: string | null }> {
    const [userId, role] = await Promise.all([
      this.getString(STORAGE_KEYS.USER_ID),
      this.getString(STORAGE_KEYS.USER_ROLE),
    ]);
    
    return { userId, role };
  }

  // Data caching methods

  /**
   * Cache projects data
   */
  async cacheProjects(projects: any[]): Promise<void> {
    await this.setObject(STORAGE_KEYS.CACHED_PROJECTS, {
      data: projects,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cached projects
   */
  async getCachedProjects(): Promise<any[] | null> {
    const cached = await this.getObject<{ data: any[]; timestamp: number }>(
      STORAGE_KEYS.CACHED_PROJECTS
    );
    
    if (!cached) return null;

    // Check if cache is stale (older than 5 minutes)
    const isStale = Date.now() - cached.timestamp > 5 * 60 * 1000;
    if (isStale) {
      await this.remove(STORAGE_KEYS.CACHED_PROJECTS);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache teams data
   */
  async cacheTeams(teams: any[]): Promise<void> {
    await this.setObject(STORAGE_KEYS.CACHED_TEAMS, {
      data: teams,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cached teams
   */
  async getCachedTeams(): Promise<any[] | null> {
    const cached = await this.getObject<{ data: any[]; timestamp: number }>(
      STORAGE_KEYS.CACHED_TEAMS
    );
    
    if (!cached) return null;

    // Check if cache is stale (older than 10 minutes)
    const isStale = Date.now() - cached.timestamp > 10 * 60 * 1000;
    if (isStale) {
      await this.remove(STORAGE_KEYS.CACHED_TEAMS);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache tasks data
   */
  async cacheTasks(tasks: any[]): Promise<void> {
    await this.setObject(STORAGE_KEYS.CACHED_TASKS, {
      data: tasks,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cached tasks
   */
  async getCachedTasks(): Promise<any[] | null> {
    const cached = await this.getObject<{ data: any[]; timestamp: number }>(
      STORAGE_KEYS.CACHED_TASKS
    );
    
    if (!cached) return null;

    // Check if cache is stale (older than 2 minutes)
    const isStale = Date.now() - cached.timestamp > 2 * 60 * 1000;
    if (isStale) {
      await this.remove(STORAGE_KEYS.CACHED_TASKS);
      return null;
    }

    return cached.data;
  }

  // User preferences methods

  /**
   * Store user preferences
   */
  async setUserPreferences(preferences: any): Promise<void> {
    await this.setObject(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<any> {
    return await this.getObject(STORAGE_KEYS.USER_PREFERENCES) || {};
  }

  /**
   * Store theme preference
   */
  async setThemeMode(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.setString(STORAGE_KEYS.THEME_MODE, theme);
  }

  /**
   * Get theme preference
   */
  async getThemeMode(): Promise<'light' | 'dark' | 'auto'> {
    return (await this.getString(STORAGE_KEYS.THEME_MODE)) as 'light' | 'dark' | 'auto' || 'auto';
  }

  // App state methods

  /**
   * Check if app is first launch
   */
  async isFirstLaunch(): Promise<boolean> {
    const firstLaunch = await this.getString(STORAGE_KEYS.APP_FIRST_LAUNCH);
    if (firstLaunch === null) {
      await this.setString(STORAGE_KEYS.APP_FIRST_LAUNCH, 'false');
      return true;
    }
    return false;
  }

  /**
   * Set onboarding completed
   */
  async setOnboardingCompleted(): Promise<void> {
    await this.setString(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  }

  /**
   * Check if onboarding is completed
   */
  async isOnboardingCompleted(): Promise<boolean> {
    return (await this.getString(STORAGE_KEYS.ONBOARDING_COMPLETED)) === 'true';
  }

  /**
   * Set last sync time
   */
  async setLastSyncTime(): Promise<void> {
    await this.setString(STORAGE_KEYS.LAST_SYNC_TIME, Date.now().toString());
  }

  /**
   * Get last sync time
   */
  async getLastSyncTime(): Promise<number> {
    const timestamp = await this.getString(STORAGE_KEYS.LAST_SYNC_TIME);
    return timestamp ? parseInt(timestamp, 10) : 0;
  }

  // Search history methods

  /**
   * Add search to recent searches
   */
  async addRecentSearch(search: string): Promise<void> {
    const recentSearches = await this.getObject<string[]>(STORAGE_KEYS.RECENT_SEARCHES) || [];
    
    // Remove if already exists
    const filtered = recentSearches.filter(s => s !== search);
    
    // Add to beginning
    filtered.unshift(search);
    
    // Keep only last 10 searches
    const limited = filtered.slice(0, 10);
    
    await this.setObject(STORAGE_KEYS.RECENT_SEARCHES, limited);
  }

  /**
   * Get recent searches
   */
  async getRecentSearches(): Promise<string[]> {
    return await this.getObject<string[]>(STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  /**
   * Clear recent searches
   */
  async clearRecentSearches(): Promise<void> {
    await this.remove(STORAGE_KEYS.RECENT_SEARCHES);
  }

  // Draft methods

  /**
   * Save form draft
   */
  async saveDraft(key: string, data: any): Promise<void> {
    await this.setObject(key, {
      data,
      savedAt: Date.now(),
    });
  }

  /**
   * Get form draft
   */
  async getDraft(key: string): Promise<any> {
    const draft = await this.getObject<{ data: any; savedAt: number }>(key);
    return draft?.data || null;
  }

  /**
   * Clear form draft
   */
  async clearDraft(key: string): Promise<void> {
    await this.remove(key);
  }

  /**
   * Check if draft exists and is recent (within 24 hours)
   */
  async hasRecentDraft(key: string): Promise<boolean> {
    const draft = await this.getObject<{ data: any; savedAt: number }>(key);
    if (!draft) return false;

    const isRecent = Date.now() - draft.savedAt < 24 * 60 * 60 * 1000; // 24 hours
    return isRecent;
  }

  // Utility methods

  /**
   * Get storage info (for debugging)
   */
  async getStorageInfo(): Promise<{
    keys: string[];
    totalSize: number;
  }> {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await this.getString(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return {
        keys,
        totalSize,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { keys: [], totalSize: 0 };
    }
  }

  /**
   * Clear all cached data (keep auth and preferences)
   */
  async clearCachedData(): Promise<void> {
    const keysToKeep = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USER_ROLE,
      STORAGE_KEYS.USER_PREFERENCES,
      STORAGE_KEYS.THEME_MODE,
      STORAGE_KEYS.LANGUAGE,
      STORAGE_KEYS.NOTIFICATION_SETTINGS,
      STORAGE_KEYS.APP_FIRST_LAUNCH,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      STORAGE_KEYS.APP_VERSION,
    ];

    const allKeys = await this.getAllKeys();
    const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));

    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }
  }
}

// Create and export a singleton instance
export const storageHelper = new StorageHelper();

// Default export
export default storageHelper;