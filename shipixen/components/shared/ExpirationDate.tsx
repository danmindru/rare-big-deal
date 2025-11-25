'use client';

interface ExpirationDateProps {
  date: string;
}

export default function ExpirationDate({ date }: ExpirationDateProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

  return (
    <p className="text-sm text-muted-foreground mt-2">
      The discount is available through{' '}
      <time className="font-semibold" dateTime={date}>
        {formattedDate}
      </time>
    </p>
  );
}
