/**
 * Date formatting and manipulation utilities
 */

/**
 * Format date to readable string
 * @param date - Date string, Date object, or Timestamp
 * @param format - Format type: 'short', 'long', 'time', 'relative', 'input'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | any, // Allow Firestore Timestamp
  format: 'short' | 'long' | 'time' | 'relative' | 'input' = 'short'
): string {
  let dateObj: Date;

  // Handle Firestore Timestamp
  if (date && typeof date === 'object' && 'toDate' in date) {
    dateObj = date.toDate();
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return 'Invalid Date';
  }

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'relative':
      return getRelativeTime(dateObj);

    case 'input':
      return dateObj.toISOString().split('T')[0];

    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

/**
 * Format date with time
 * @param date - Date string or Date object
 * @returns Formatted date with time string
 */
export function formatDateTime(date: string | Date | any): string {
  const dateObj = getDateObject(date);
  if (!dateObj) return 'Invalid Date';

  return `${formatDate(dateObj, 'short')} at ${formatDate(dateObj, 'time')}`;
}

/**
 * Format date for display in lists
 * @param date - Date string or Date object
 * @returns Formatted date for list display
 */
export function formatDateForList(date: string | Date | any): string {
  const dateObj = getDateObject(date);
  if (!dateObj) return 'Invalid Date';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(dateObj, today)) return 'Today';
  if (isSameDay(dateObj, yesterday)) return 'Yesterday';
  if (isSameDay(dateObj, tomorrow)) return 'Tomorrow';

  // If within the last 7 days, show day name
  const daysDiff = getDaysDifference(dateObj, today);
  if (Math.abs(daysDiff) < 7) {
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Otherwise show short date
  return formatDate(dateObj, 'short');
}

/**
 * Get relative time string (e.g., "2 days ago", "in 1 week")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date | any): string {
  const dateObj = getDateObject(date);
  if (!dateObj) return 'Invalid Date';

  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInSeconds = Math.round(diffInMs / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);
  const diffInWeeks = Math.round(diffInDays / 7);
  const diffInMonths = Math.round(diffInDays / 30);
  const diffInYears = Math.round(diffInDays / 365);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffInYears) > 0) {
    return rtf.format(diffInYears, 'year');
  } else if (Math.abs(diffInMonths) > 0) {
    return rtf.format(diffInMonths, 'month');
  } else if (Math.abs(diffInWeeks) > 0) {
    return rtf.format(diffInWeeks, 'week');
  } else if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, 'minute');
  } else {
    return 'just now';
  }
}

/**
 * Check if date is today
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is today
 */
export function isToday(date: string | Date | any): boolean {
  const dateObj = getDateObject(date);
  if (!dateObj) return false;

  const today = new Date();
  return isSameDay(dateObj, today);
}

/**
 * Check if date is in the past
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is in past
 */
export function isPastDate(date: string | Date | any): boolean {
  const dateObj = getDateObject(date);
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj < today;
}

/**
 * Check if date is in the future
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is in future
 */
export function isFutureDate(date: string | Date | any): boolean {
  const dateObj = getDateObject(date);
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj > today;
}

/**
 * Check if date is within a certain number of days from today
 * @param date - Date string or Date object
 * @param days - Number of days
 * @returns Boolean indicating if date is within the specified days
 */
export function isWithinDays(date: string | Date | any, days: number): boolean {
  const dateObj = getDateObject(date);
  if (!dateObj) return false;

  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + days);

  return dateObj >= today && dateObj <= targetDate;
}

/**
 * Check if date is overdue
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is overdue
 */
export function isOverdue(date: string | Date | any): boolean {
  const dateObj = getDateObject(date);
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj < today;
}

/**
 * Get days difference between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference
 */
export function getDaysDifference(date1: string | Date | any, date2: string | Date | any): number {
  const d1 = getDateObject(date1);
  const d2 = getDateObject(date2);
  
  if (!d1 || !d2) return 0;

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a date
 * @param date - Date string or Date object
 * @param days - Number of days to add
 * @returns New Date object
 */
export function addDays(date: string | Date | any, days: number): Date {
  const dateObj = getDateObject(date);
  if (!dateObj) return new Date();

  const newDate = new Date(dateObj);
  newDate.setDate(dateObj.getDate() + days);
  return newDate;
}

/**
 * Get start of day
 * @param date - Date string or Date object
 * @returns Date object set to start of day
 */
export function startOfDay(date: string | Date | any): Date {
  const dateObj = getDateObject(date);
  if (!dateObj) return new Date();

  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Get end of day
 * @param date - Date string or Date object
 * @returns Date object set to end of day
 */
export function endOfDay(date: string | Date | any): Date {
  const dateObj = getDateObject(date);
  if (!dateObj) return new Date();

  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Boolean indicating if dates are the same day
 */
export function isSameDay(date1: string | Date | any, date2: string | Date | any): boolean {
  const d1 = getDateObject(date1);
  const d2 = getDateObject(date2);
  
  if (!d1 || !d2) return false;

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

/**
 * Get week number for a date
 * @param date - Date string or Date object
 * @returns Week number (1-52)
 */
export function getWeekNumber(date: string | Date | any): number {
  const dateObj = getDateObject(date);
  if (!dateObj) return 0;

  const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const pastDaysOfYear = (dateObj.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Format duration in milliseconds to readable string
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

/**
 * Get age from birth date
 * @param birthDate - Birth date string or Date object
 * @returns Age in years
 */
export function getAge(birthDate: string | Date | any): number {
  const birthDateObj = getDateObject(birthDate);
  if (!birthDateObj) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}

// Helper function to convert various date types to Date object
function getDateObject(date: string | Date | any): Date | null {
  if (!date) return null;

  try {
    if (date && typeof date === 'object' && 'toDate' in date) {
      return date.toDate();
    } else if (typeof date === 'string') {
      return new Date(date);
    } else if (date instanceof Date) {
      return date;
    }
    return null;
  } catch (error) {
    console.error('Error converting to Date object:', error);
    return null;
  }
}

// Export default object with all functions
export default {
  formatDate,
  formatDateTime,
  formatDateForList,
  getRelativeTime,
  isToday,
  isPastDate,
  isFutureDate,
  isWithinDays,
  isOverdue,
  getDaysDifference,
  addDays,
  startOfDay,
  endOfDay,
  isSameDay,
  getWeekNumber,
  formatDuration,
  getAge,
};