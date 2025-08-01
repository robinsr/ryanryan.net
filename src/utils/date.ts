const fmtLongConfig: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
}

const fmtShortConfig: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric'
}

/**
 * Format a date to a long format, eg "July 29, 2025"
 * @param date - The date to format
 * @returns The formatted date
 */
export function formatDateLong(date: Date | string): string {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	try {
		return new Intl.DateTimeFormat('en-US', fmtLongConfig).format(date);
	} catch (error) {
		console.error(error);
		return 'Invalid date ' + date;
	}
}

/**
 * Format a date or date string to a short format, eg "Jul 29"
 * @param date - The date to format
 * @returns The formatted date
 */
export function formatDateShort(date: Date | string): string {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	try {
		return new Intl.DateTimeFormat('en-US', fmtShortConfig).format(date);
	} catch (error) {
		console.error(error);
		return 'Invalid date ' + date;
	}
}

/**
 * Formats a date or date string to the ISO date format, eg "2025-07-29"
 * @param date - The date to format
 * @returns The formatted date
 */
export function formatDateISO(date: Date | string): string {

	if (typeof date === 'string') {
		date = new Date(date);
	}

	try {
		return date.toISOString().split('T')[0];
	} catch (error) {
		console.error(error);
		return 'Invalid date ' + date;
	}
} 


/**
 * Display a date as a month and year, eg "July 2025"
 * @param dateString - The date to format
 * @returns The formatted date
 */
export function displayMonthYear(dateString: string): string {
  const date = new Date(dateString);
  
	return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
}


/**
 * Display a date range as a month and year range, eg "July 2025 - Present"
 * @param startDate - The start date
 * @param endDate - The end date
 * @param current - Whether the end date is the current date
 * @returns The formatted date range
 */
export function displayMonthYearRange(startDate: string, endDate?: string, current?: boolean): string {
  const start = displayMonthYear(startDate);
  if (current) {
    return `${start} - Present`;
  }
  if (endDate) {
    const end = displayMonthYear(endDate);
    return `${start} - ${end}`;
  }
  return start;
}