/**
 * Name and string manipulation utilities
 */

/**
 * Generate initials from a name
 * @param name - Full name string
 * @param maxLength - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials
 */
export function generateInitials(name: string, maxLength: number = 2): string {
  if (!name || typeof name !== 'string') {
    return '?';
  }

  // Clean the name - remove extra spaces and special characters
  const cleanName = name.trim().replace(/\s+/g, ' ');

  if (cleanName.length === 0) {
    return '?';
  }

  // Split by spaces and filter out empty parts
  const nameParts = cleanName.split(' ').filter(part => part.length > 0);

  if (nameParts.length === 0) {
    return '?';
  }

  // If only one part, take first maxLength characters
  if (nameParts.length === 1) {
    return nameParts[0]
      .substring(0, maxLength)
      .toUpperCase();
  }

  // Multiple parts - take first letter from first and last parts
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];

  let initials = firstInitial + lastInitial;

  // If we need more than 2 initials, include middle names
  if (maxLength > 2 && nameParts.length > 2) {
    for (let i = 1; i < nameParts.length - 1 && initials.length < maxLength; i++) {
      initials += nameParts[i][0];
    }
  }

  return initials.toUpperCase();
}

/**
 * Generate avatar color based on name (consistent hashing)
 * @param name - Name to generate color for
 * @returns Hex color code
 */
export function generateAvatarColor(name: string): string {
  if (!name) return '#6c757d'; // Default gray

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Predefined set of attractive colors
  const colors = [
    '#007bff', // Blue
    '#28a745', // Green
    '#dc3545', // Red
    '#ffc107', // Yellow
    '#6f42c1', // Purple
    '#e83e8c', // Pink
    '#fd7e14', // Orange
    '#20c997', // Teal
    '#17a2b8', // Cyan
    '#343a40', // Dark
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Format name for display (Title Case)
 * @param name - Name to format
 * @returns Formatted name
 */
export function formatName(name: string): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract first name from full name
 * @param fullName - Full name string
 * @returns First name
 */
export function getFirstName(fullName: string): string {
  if (!fullName) return '';

  const names = fullName.trim().split(/\s+/);
  return names[0] || '';
}

/**
 * Extract last name from full name
 * @param fullName - Full name string
 * @returns Last name
 */
export function getLastName(fullName: string): string {
  if (!fullName) return '';

  const names = fullName.trim().split(/\s+/);
  return names.length > 1 ? names[names.length - 1] : '';
}

/**
 * Abbreviate long names for display
 * @param name - Name to abbreviate
 * @param maxLength - Maximum length before abbreviation
 * @returns Abbreviated name
 */
export function abbreviateName(name: string, maxLength: number = 20): string {
  if (!name || name.length <= maxLength) {
    return name || '';
  }

  const names = name.split(' ');
  
  if (names.length === 1) {
    // Single word - truncate
    return name.substring(0, maxLength - 3) + '...';
  }

  // Multiple words - use initials for middle names
  const firstName = names[0];
  const lastName = names[names.length - 1];
  
  let abbreviated = firstName;
  
  // Add middle initials if needed
  for (let i = 1; i < names.length - 1; i++) {
    abbreviated += ` ${names[i][0]}.`;
  }
  
  abbreviated += ` ${lastName}`;
  
  // If still too long, truncate last name
  if (abbreviated.length > maxLength) {
    const availableSpace = maxLength - (firstName.length + 4); // +4 for " X. "
    if (availableSpace > 3) {
      abbreviated = `${firstName} ${lastName.substring(0, availableSpace)}...`;
    } else {
      abbreviated = `${firstName}...`;
    }
  }
  
  return abbreviated;
}

/**
 * Generate username from email address
 * @param email - Email address
 * @returns Username (part before @)
 */
export function generateUsernameFromEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return 'user';
  }

  return email.split('@')[0].toLowerCase();
}

/**
 * Generate display name from parts
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Formatted display name
 */
export function generateDisplayName(firstName: string, lastName: string): string {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();

  if (first && last) {
    return `${first} ${last}`;
  } else if (first) {
    return first;
  } else if (last) {
    return last;
  } else {
    return 'User';
  }
}

/**
 * Check if a string contains only letters and spaces
 * @param str - String to validate
 * @returns Boolean indicating if valid name
 */
export function isValidName(str: string): boolean {
  if (!str) return false;
  
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(str.trim());
}

/**
 * Capitalize first letter of each word
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate random name (for testing/demo purposes)
 * @param type - Type of name: 'first' | 'last' | 'full'
 * @returns Random name
 */
export function generateRandomName(type: 'first' | 'last' | 'full' = 'full'): string {
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
  ];

  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  switch (type) {
    case 'first':
      return randomFirstName;
    case 'last':
      return randomLastName;
    case 'full':
    default:
      return `${randomFirstName} ${randomLastName}`;
  }
}

/**
 * Generate slug from name (URL-friendly)
 * @param name - Name to slugify
 * @returns URL-friendly slug
 */
export function generateSlug(name: string): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract initials from email (fallback when name is not available)
 * @param email - Email address
 * @returns Initials from email
 */
export function generateInitialsFromEmail(email: string): string {
  if (!email) return '?';

  const username = email.split('@')[0];
  
  // Try to split by common separators
  const parts = username.split(/[._-]/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  // Fallback to first two characters of username
  return username.substring(0, 2).toUpperCase();
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Boolean indicating valid email
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Obfuscate email for display
 * @param email - Email to obfuscate
 * @returns Obfuscated email
 */
export function obfuscateEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email || '';
  }

  const [localPart, domain] = email.split('@');
  const obfuscatedLocal = localPart.length > 2 
    ? localPart.substring(0, 2) + '***' 
    : '***';
  
  return `${obfuscatedLocal}@${domain}`;
}

// Export default object with all functions
export default {
  generateInitials,
  generateAvatarColor,
  formatName,
  getFirstName,
  getLastName,
  abbreviateName,
  generateUsernameFromEmail,
  generateDisplayName,
  isValidName,
  capitalizeWords,
  generateRandomName,
  generateSlug,
  generateInitialsFromEmail,
  isValidEmail,
  obfuscateEmail,
};