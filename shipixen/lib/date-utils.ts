/**
 * Utility functions for safe date parsing and validation
 */

/**
 * Safely parse a date string and validate it
 * @param dateString - Date string to parse
 * @returns A valid Date object or null if the date is invalid
 */
export function parseAndValidateDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    const parsedDate = new Date(dateString);
    
    // Check if the date is valid (not NaN)
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date provided: "${dateString}"`);
      return null;
    }
    
    return parsedDate;
  } catch (error) {
    console.warn(`Error parsing date "${dateString}":`, error);
    return null;
  }
}

/**
 * Format a date string using Intl.DateTimeFormat
 * @param dateString - Date string to format
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or null if the date is invalid
 */
export function formatDate(
  dateString: string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string | null {
  const date = parseAndValidateDate(dateString);
  
  if (!date) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.warn(`Error formatting date "${dateString}":`, error);
    return null;
  }
}