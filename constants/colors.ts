// Primary Colors
export const PRIMARY = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
};

// Secondary Colors
export const SECONDARY = {
  50: '#fce4ec',
  100: '#f8bbd9',
  200: '#f48fb1',
  300: '#f06292',
  400: '#ec407a',
  500: '#e91e63',
  600: '#d81b60',
  700: '#c2185b',
  800: '#ad1457',
  900: '#880e4f',
};

// Success Colors
export const SUCCESS = {
  50: '#e8f5e8',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
};

// Warning Colors
export const WARNING = {
  50: '#fffde7',
  100: '#fff9c4',
  200: '#fff59d',
  300: '#fff176',
  400: '#ffee58',
  500: '#ffeb3b',
  600: '#fdd835',
  700: '#fbc02d',
  800: '#f9a825',
  900: '#f57f17',
};

// Error/Danger Colors
export const ERROR = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
};

// Neutral Colors
export const NEUTRAL = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// Semantic Colors
export const SEMANTIC = {
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef',
    dark: '#1a1a1a',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9e9e9e',
    inverse: '#ffffff',
    disabled: '#bdbdbd',
    link: '#2196f3',
  },

  // Border Colors
  border: {
    light: '#e0e0e0',
    default: '#bdbdbd',
    dark: '#757575',
    focus: '#2196f3',
    error: '#f44336',
  },

  // Status Colors
  status: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    disabled: '#9e9e9e',
  },

  // Button Colors
  button: {
    primary: {
      background: '#2196f3',
      text: '#ffffff',
      border: '#2196f3',
    },
    secondary: {
      background: 'transparent',
      text: '#2196f3',
      border: '#2196f3',
    },
    danger: {
      background: '#f44336',
      text: '#ffffff',
      border: '#f44336',
    },
    success: {
      background: '#4caf50',
      text: '#ffffff',
      border: '#4caf50',
    },
    warning: {
      background: '#ff9800',
      text: '#ffffff',
      border: '#ff9800',
    },
    disabled: {
      background: '#e0e0e0',
      text: '#9e9e9e',
      border: '#e0e0e0',
    },
  },

  // Chart Colors (for graphs and visualizations)
  chart: {
    blue: '#2196f3',
    green: '#4caf50',
    yellow: '#ffeb3b',
    orange: '#ff9800',
    red: '#f44336',
    purple: '#9c27b0',
    cyan: '#00bcd4',
    pink: '#e91e63',
  },

  // Social Media Colors
  social: {
    facebook: '#1877f2',
    twitter: '#1da1f2',
    linkedin: '#0a66c2',
    instagram: '#e4405f',
    youtube: '#ff0000',
    github: '#333333',
    google: '#db4437',
  },
};

// Project Specific Colors
export const PROJECT = {
  internBridge: {
    primary: '#2196f3',
    secondary: '#ff9800',
    accent: '#4caf50',
    background: '#f8f9fa',
    text: '#212121',
  },
};

// Status Colors for Tasks/Projects
export const STATUS_COLORS = {
  // Task Status
  task: {
    'not-started': NEUTRAL[500],
    ongoing: WARNING[500],
    done: SUCCESS[500],
  },

  // Project Status
  project: {
    'not-started': NEUTRAL[500],
    ongoing: WARNING[500],
    completed: SUCCESS[500],
    cancelled: ERROR[500],
  },

  // Sprint Status
  sprint: {
    'not-started': NEUTRAL[500],
    'in-progress': WARNING[500],
    completed: SUCCESS[500],
  },

  // Priority Colors
  priority: {
    low: SUCCESS[500],
    medium: WARNING[500],
    high: ERROR[500],
    urgent: ERROR[900],
  },
};

// Gradient Colors
export const GRADIENTS = {
  primary: ['#2196f3', '#1976d2'],
  success: ['#4caf50', '#388e3c'],
  warning: ['#ff9800', '#f57c00'],
  error: ['#f44336', '#d32f2f'],
  sunset: ['#ff6b6b', '#ffa726', '#ffeb3b'],
  ocean: ['#2196f3', '#00bcd4', '#4caf50'],
};

// Shadow Colors
export const SHADOWS = {
  sm: {
    shadowColor: NEUTRAL[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: NEUTRAL[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: NEUTRAL[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  xl: {
    shadowColor: NEUTRAL[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Export default color palette
export default {
  PRIMARY,
  SECONDARY,
  SUCCESS,
  WARNING,
  ERROR,
  NEUTRAL,
  SEMANTIC,
  PROJECT,
  STATUS_COLORS,
  GRADIENTS,
  SHADOWS,
};