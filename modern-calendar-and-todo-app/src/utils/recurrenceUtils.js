/**
 * Utility functions for computing recurring dates
 * @module recurrenceUtils
 */

/**
 * Calculate recurring dates based on pattern and range
 * @param {Object} recurrence - Recurrence pattern
 * @param {Object} dateRange - Date range
 * @returns {Date[]} Array of recurring dates
 */
export function calculateRecurringDates(recurrence, dateRange) {
  const { type, interval, daysOfWeek, dayOfMonth, monthOfYear } = recurrence;
  const { startDate, endDate } = dateRange;
  const dates = [];
  let currentDate = new Date(startDate);
  const maxIterations = 100;
  let iterations = 0;

  while ((!endDate || currentDate <= endDate) && iterations < maxIterations) {
    dates.push(new Date(currentDate));
    switch (type) {
      case 'daily':
        currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        currentDate = new Date(currentDate.getTime() + interval * 7 * 24 * 60 * 60 * 1000);
        if (daysOfWeek) {
          const nextValidDate = new Date(currentDate);
          while (!daysOfWeek.includes(nextValidDate.getDay())) {
            nextValidDate.setDate(nextValidDate.getDate() + 1);
          }
          currentDate = nextValidDate;
        }
        break;
      case 'monthly':
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + interval, dayOfMonth || currentDate.getDate());
        break;
      case 'yearly':
        currentDate = new Date(currentDate.getFullYear() + interval, monthOfYear || currentDate.getMonth(), dayOfMonth || currentDate.getDate());
        break;
    }
    iterations++;
  }
  return dates;
}