import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  CACHED_PROJECTS: 'cached_projects',
  CACHED_TEAMS: 'cached_teams',
  LAST_SYNC_TIME: 'last_sync_time',
  AUTH_TOKEN: 'auth_token',
  USER_ROLE: 'user_role',
} as const;

/**
 * Store string value in AsyncStorage
 * @param key - Storage key
 * @param value - String value to store
 */
export async function storeString(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing string for key ${key}:`, error);
    throw error;
  }
}

/**
 * Get string value from AsyncStorage
 * @param key - Storage key
 * @returns Stored string value or null
 */
export async function getString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting string for key ${key}:`, error);
    return null;
  }
}

/**
 * Store object value in AsyncStorage
 * @param key - Storage key
 * @param value - Object value to store
 */
export async function storeObject<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing object for key ${key}:`, error);
    throw error;
  }
}

/**
 * Get object value from AsyncStorage
 * @param key - Storage key
 * @returns Parsed object or null
 */
export async function getObject<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (error) {
    console.error(`Error getting object for key ${key}:`, error);
    return null;
  }
}

/**
 * Remove item from AsyncStorage
 * @param key - Storage key to remove
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item for key ${key}:`, error);
    throw error;
  }
}

/**
 * Clear all data from AsyncStorage
 */
export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

/**
 * Get multiple items from AsyncStorage
 * @param keys - Array of keys to retrieve
 * @returns Object with key-value pairs
 */
export async function multiGet(keys: string[]): Promise<Record<string, any>> {
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
 * @param keyValuePairs - Object with key-value pairs to store
 */
export async function multiSet(keyValuePairs: Record<string, any>): Promise<void> {
  try {
    const pairs = Object.entries(keyValuePairs).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    ]);
    
    await AsyncStorage.multiSet(pairs as [string, string][]);
  } catch (error) {
    console.error('Error in multiSet:', error);
    throw error;
  }
}

/**
 * Get all keys from AsyncStorage
 * @returns Array of storage keys
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
}

/**
 * Check if key exists in AsyncStorage
 * @param key - Storage key to check
 * @returns Boolean indicating if key exists
 */
export async function hasKey(key: string): Promise<boolean> {
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
 * @param key - Storage key
 * @param newData - New data to merge
 */
export async function mergeObject<T extends Record<string, any>>(
  key: string, 
  newData: Partial<T>
): Promise<void> {
  try {
    const existingData = await getObject<T>(key) || {} as T;
    const mergedData = { ...existingData, ...newData };
    await storeObject(key, mergedData);
  } catch (error) {
    console.error(`Error merging object for key ${key}:`, error);
    throw error;
  }
}

/**
 * Storage helper with type safety for common operations
 */
export const storage = {
  // Auth related
  setAuthToken: (token: string) => storeString(STORAGE_KEYS.AUTH_TOKEN, token),
  getAuthToken: () => getString(STORAGE_KEYS.AUTH_TOKEN),
  setUserRole: (role: string) => storeString(STORAGE_KEYS.USER_ROLE, role),
  getUserRole: () => getString(STORAGE_KEYS.USER_ROLE),
  
  // Data caching
  cacheProjects: (projects: any[]) => storeObject(STORAGE_KEYS.CACHED_PROJECTS, projects),
  getCachedProjects: () => getObject<any[]>(STORAGE_KEYS.CACHED_PROJECTS),
  cacheTeams: (teams: any[]) => storeObject(STORAGE_KEYS.CACHED_TEAMS, teams),
  getCachedTeams: () => getObject<any[]>(STORAGE_KEYS.CACHED_TEAMS),
  
  // User preferences
  setUserPreferences: (prefs: any) => storeObject(STORAGE_KEYS.USER_PREFERENCES, prefs),
  getUserPreferences: () => getObject(STORAGE_KEYS.USER_PREFERENCES),
  
  // Sync management
  setLastSyncTime: (time: string) => storeString(STORAGE_KEYS.LAST_SYNC_TIME, time),
  getLastSyncTime: () => getString(STORAGE_KEYS.LAST_SYNC_TIME),
  
  // Clear all app data
  clearAll: () => clearStorage(),
  
  // Clear only auth data
  clearAuthData: async () => {
    await removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await removeItem(STORAGE_KEYS.USER_ROLE);
  },
};

export default storage;