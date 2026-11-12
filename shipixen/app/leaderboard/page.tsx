import { genPageMetadata } from 'app/seo';
import leaderboards from '@/data/leaderboards';
import LeaderboardClient from './LeaderboardClient';

const updated = leaderboards.current.updatedLabel;

export const metadata = genPageMetadata({
  title: 'Most popular deals',
  description: `Most viewed deals on Rare Big Deal, based on site analytics, updated ${updated}.`,
});

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
