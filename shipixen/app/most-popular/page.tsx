import { genPageMetadata } from 'app/seo';
import MostPopularClient from './MostPopularClient';

export const metadata = genPageMetadata({
  title: 'Top 25 Most Popular Deals and Discounts',
  description:
    'Here are the top 25 deals on iOS, Mac, SaaS, AI and Web apps. Discover the most popular lifetime deals, discounts, and exclusive offers.',
});

export default function CategoryPage() {
  return <MostPopularClient />;
}
