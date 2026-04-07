'use client';

import { formatDate } from '@/lib/date-utils';

interface ExpirationDateProps {
  date: string;
}

export default function ExpirationDate({ date }: ExpirationDateProps) {
  try {
    const formattedDate = formatDate(date);
    
    // If date is invalid, don't render anything
    if (!formattedDate) {
      return null;
    }

    return (
      <p className="text-sm text-muted-foreground mt-2">
        The discount is available through{' '}
        <time className="font-semibold" dateTime={date}>
          {formattedDate}
        </time>
      </p>
    );
  } catch (error) {
    console.error(`Error rendering ExpirationDate for date "${date}":`, error);
    return null;
  }
}
