/**
 * Date calculation and day counting utilities
 */

/**
 * Calculate days since a start date
 * @param startDate - Start date string, Date object, or Timestamp
 * @returns Number of days since start date
 */
export function calculateDaysSince(startDate: string | Date | any): number {
  const start = getDateObject(startDate);
  if (!start) return 0;

  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days until a future date
 * @param futureDate - Future date string, Date object, or Timestamp
 * @returns Number of days until future date (negative if past)
 */
export function calculateDaysUntil(futureDate: string | Date | any): number {
  const future = getDateObject(futureDate);
  if (!future) return 0;

  const today = new Date();
  const diffTime = future.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate working days between two dates (excluding weekends)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of working days
 */
export function calculateWorkingDays(startDate: string | Date | any, endDate: string | Date | any): number {
  const start = getDateObject(startDate);
  const end = getDateObject(endDate);
  
  if (!start || !end) return 0;

  // Swap dates if start is after end
  if (start > end) {
    [start, end] = [end, start];
  }

  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Sunday = 0, Saturday = 6
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Calculate project progress based on dates
 * @param startDate - Project start date
 * @param endDate - Project end date
 * @param currentDate - Current date (defaults to now)
 * @returns Progress percentage (0-100)
 */
export function calculateDateProgress(
  startDate: string | Date | any,
  endDate: string | Date | any,
  currentDate: string | Date | any = new Date()
): number {
  const start = getDateObject(startDate);
  const end = getDateObject(endDate);
  const current = getDateObject(currentDate);
  
  if (!start || !end || !current) return 0;

  // If current date is before start, progress is 0
  if (current < start) return 0;

  // If current date is after end, progress is 100
  if (current > end) return 100;

  const totalDuration = end.getTime() - start.getTime();
  const elapsedDuration = current.getTime() - start.getTime();

  return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
}

/**
 * Calculate sprint progress based on dates and tasks
 * @param sprint - Sprint object with startDate, endDate, and task counts
 * @returns Progress percentage (0-100)
 */
export function calculateSprintProgress(sprint: {
  startDate: string | Date | any;
  endDate: string | Date | any;
  totalTasks: number;
  completedTasks: number;
}): number {
  const dateProgress = calculateDateProgress(sprint.startDate, sprint.endDate);
  
  if (sprint.totalTasks === 0) {
    return dateProgress;
  }

  const taskProgress = (sprint.completedTasks / sprint.totalTasks) * 100;
  
  // Weighted average: 40% date progress, 60% task progress
  return (dateProgress * 0.4) + (taskProgress * 0.6);
}

/**
 * Calculate task due status
 * @param dueDate - Task due date
 * @param completionDate - Task completion date (optional)
 * @returns Due status object
 */
export function calculateDueStatus(
  dueDate: string | Date | any,
  completionDate?: string | Date | any
): {
  status: 'ontime' | 'overdue' | 'completed' | 'future';
  days: number;
  label: string;
} {
  const due = getDateObject(dueDate);
  const completed = completionDate ? getDateObject(completionDate) : null;
  const today = new Date();

  if (!due) {
    return { status: 'future', days: 0, label: 'No due date' };
  }

  if (completed) {
    const daysUntilDueWhenCompleted = calculateDaysUntil(due);
    return {
      status: daysUntilDueWhenCompleted >= 0 ? 'ontime' : 'overdue',
      days: Math.abs(daysUntilDueWhenCompleted),
      label: daysUntilDueWhenCompleted >= 0 ? 'Completed on time' : 'Completed late',
    };
  }

  const daysUntilDue = calculateDaysUntil(due);

  if (daysUntilDue < 0) {
    return {
      status: 'overdue',
      days: Math.abs(daysUntilDue),
      label: `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue`,
    };
  } else if (daysUntilDue === 0) {
    return {
      status: 'overdue',
      days: 0,
      label: 'Due today',
    };
  } else if (daysUntilDue <= 7) {
    return {
      status: 'ontime',
      days: daysUntilDue,
      label: `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
    };
  } else {
    return {
      status: 'future',
      days: daysUntilDue,
      label: `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
    };
  }
}

/**
 * Calculate estimated completion date based on progress and velocity
 * @param startDate - Start date
 * @param progress - Current progress percentage (0-100)
 * @param velocity - Daily progress rate (percentage per day)
 * @returns Estimated completion date
 */
export function calculateEstimatedCompletion(
  startDate: string | Date | any,
  progress: number,
  velocity: number
): Date | null {
  const start = getDateObject(startDate);
  if (!start || velocity <= 0) return null;

  const remainingProgress = 100 - progress;
  const daysRemaining = remainingProgress / velocity;
  
  const completionDate = new Date(start);
  completionDate.setDate(completionDate.getDate() + daysRemaining);
  
  return completionDate;
}

/**
 * Calculate team velocity based on sprint history
 * @param sprints - Array of sprints with completed story points
 * @returns Average velocity
 */
export function calculateTeamVelocity(sprints: Array<{
  completedStoryPoints: number;
  actualVelocity?: number;
}>): number {
  if (sprints.length === 0) return 0;

  const validSprints = sprints.filter(sprint => 
    sprint.completedStoryPoints > 0 || (sprint.actualVelocity && sprint.actualVelocity > 0)
  );

  if (validSprints.length === 0) return 0;

  const totalVelocity = validSprints.reduce((sum, sprint) => {
    return sum + (sprint.actualVelocity || sprint.completedStoryPoints);
  }, 0);

  return Math.round(totalVelocity / validSprints.length);
}

/**
 * Calculate task efficiency based on estimated vs actual time
 * @param estimatedHours - Estimated hours
 * @param actualHours - Actual hours spent
 * @returns Efficiency percentage (over 100% = efficient, under 100% = inefficient)
 */
export function calculateTaskEfficiency(estimatedHours: number, actualHours: number): number {
  if (estimatedHours <= 0) return 0;
  if (actualHours <= 0) return 0;

  return (estimatedHours / actualHours) * 100;
}

/**
 * Calculate project timeline risk
 * @param startDate - Project start date
 * @param endDate - Project end date
 * @param currentProgress - Current progress percentage
 * @returns Risk level: 'low' | 'medium' | 'high' | 'critical'
 */
export function calculateTimelineRisk(
  startDate: string | Date | any,
  endDate: string | Date | any,
  currentProgress: number
): 'low' | 'medium' | 'high' | 'critical' {
  const start = getDateObject(startDate);
  const end = getDateObject(endDate);
  
  if (!start || !end) return 'medium';

  const today = new Date();
  const totalDuration = end.getTime() - start.getTime();
  const elapsedDuration = today.getTime() - start.getTime();
  
  if (elapsedDuration <= 0) return 'low';

  const expectedProgress = (elapsedDuration / totalDuration) * 100;
  const progressDifference = currentProgress - expectedProgress;

  if (progressDifference >= 10) return 'low';
  if (progressDifference >= -5) return 'medium';
  if (progressDifference >= -15) return 'high';
  return 'critical';
}

/**
 * Calculate days until next milestone
 * @param milestones - Array of milestone dates
 * @returns Days until next milestone and the milestone date
 */
export function calculateDaysUntilNextMilestone(
  milestones: Array<string | Date | any>
): { days: number; milestone: Date | null } {
  const today = new Date();
  let nextMilestone: Date | null = null;
  let minDays = Infinity;

  milestones.forEach(milestone => {
    const milestoneDate = getDateObject(milestone);
    if (!milestoneDate) return;

    const daysUntil = calculateDaysUntil(milestoneDate);
    if (daysUntil >= 0 && daysUntil < minDays) {
      minDays = daysUntil;
      nextMilestone = milestoneDate;
    }
  });

  return {
    days: minDays === Infinity ? -1 : minDays,
    milestone: nextMilestone,
  };
}

/**
 * Calculate age in years, months, and days
 * @param birthDate - Birth date
 * @returns Age object with years, months, and days
 */
export function calculateDetailedAge(birthDate: string | Date | any): {
  years: number;
  months: number;
  days: number;
} {
  const birth = getDateObject(birthDate);
  if (!birth) return { years: 0, months: 0, days: 0 };

  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Get days in previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculate business hours between two dates (9 AM - 5 PM, Mon-Fri)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Business hours between dates
 */
export function calculateBusinessHours(startDate: string | Date | any, endDate: string | Date | any): number {
  const start = getDateObject(startDate);
  const end = getDateObject(endDate);
  
  if (!start || !end || start >= end) return 0;

  let businessHours = 0;
  const current = new Date(start);

  while (current < end) {
    const dayOfWeek = current.getDay();
    const hour = current.getHours();

    // Check if it's a business day (Mon-Fri) and business hours (9 AM - 5 PM)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 17) {
      businessHours++;
    }

    current.setHours(current.getHours() + 1);
  }

  return businessHours;
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
  calculateDaysSince,
  calculateDaysUntil,
  calculateWorkingDays,
  calculateDateProgress,
  calculateSprintProgress,
  calculateDueStatus,
  calculateEstimatedCompletion,
  calculateTeamVelocity,
  calculateTaskEfficiency,
  calculateTimelineRisk,
  calculateDaysUntilNextMilestone,
  calculateDetailedAge,
  calculateBusinessHours,
};