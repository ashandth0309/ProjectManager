/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param format - Format type: 'short', 'long', 'time'
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
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
 * Format date relative to now (e.g., "2 days ago", "in 1 week")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.round(diffInMs / (1000 * 60));

  if (Math.abs(diffInMinutes) < 60) {
    return diffInMinutes < 0 ? `${Math.abs(diffInMinutes)}m ago` : `in ${diffInMinutes}m`;
  } else if (Math.abs(diffInHours) < 24) {
    return diffInHours < 0 ? `${Math.abs(diffInHours)}h ago` : `in ${diffInHours}h`;
  } else if (Math.abs(diffInDays) < 7) {
    return diffInDays < 0 ? `${Math.abs(diffInDays)}d ago` : `in ${diffInDays}d`;
  } else if (Math.abs(diffInDays) < 30) {
    const weeks = Math.round(diffInDays / 7);
    return weeks < 0 ? `${Math.abs(weeks)}w ago` : `in ${weeks}w`;
  } else {
    return formatDate(dateObj, 'short');
  }
}

/**
 * Check if date is today
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();
}

/**
 * Check if date is in the past
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is in past
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj < today;
}

/**
 * Check if date is in the future
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is in future
 */
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj > today;
}