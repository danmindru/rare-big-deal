/**
 * Utility functions for safe date parsing and validation
 */

const ISO_DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

function isDev(): boolean {
  return (
    typeof process !== 'undefined' &&
    !!process.env.NODE_ENV &&
    process.env.NODE_ENV !== 'production'
  );
}

/**
 * Safely parse a date string and validate it.
 *
 * ISO date-only strings (`YYYY-MM-DD`) are parsed as local dates to avoid
 * the off-by-one-day display issue that occurs when `new Date("YYYY-MM-DD")`
 * treats the value as UTC and the user's timezone is behind UTC.
 *
 * @param dateString - Date string to parse
 * @returns A valid Date object or null if the date is invalid
 */
export function parseAndValidateDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    let parsedDate: Date;
    const dateOnlyMatch = ISO_DATE_ONLY_REGEX.exec(dateString);

    if (dateOnlyMatch) {
      const year = Number(dateOnlyMatch[1]);
      const month = Number(dateOnlyMatch[2]);
      const day = Number(dateOnlyMatch[3]);

      parsedDate = new Date(year, month - 1, day);

      // Reject invalid calendar dates that overflow (e.g. 2024-02-30)
      if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
      ) {
        if (isDev()) {
          console.warn(`Invalid date provided: "${dateString}"`);
        }
        return null;
      }
    } else {
      parsedDate = new Date(dateString);
    }

    // Check if the date is valid (not NaN)
    if (isNaN(parsedDate.getTime())) {
      if (isDev()) {
        console.warn(`Invalid date provided: "${dateString}"`);
      }
      return null;
    }

    return parsedDate;
  } catch (error) {
    if (isDev()) {
      console.warn(`Error parsing date "${dateString}":`, error);
    }
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
    if (isDev()) {
      console.warn(`Error formatting date "${dateString}":`, error);
    }
    return null;
  }
}