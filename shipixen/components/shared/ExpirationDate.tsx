'use client';

import { formatDate } from '@/lib/date-utils';

interface ExpirationDateProps {
  date: string;
}

export default function ExpirationDate({ date }: ExpirationDateProps) {
  const formattedDate = formatDate(date);

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
}
