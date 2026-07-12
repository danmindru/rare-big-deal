import { genPageMetadata } from 'app/seo';
import ExpiresSoonClient from './ExpiresSoonClient';

export const metadata = genPageMetadata({
  title: 'Deals Expiring Soon - Limited Time Offers',
  description:
    "Don't miss out! These deals expire within the next 5 days. Discover limited-time lifetime deals, discounts, and exclusive offers on iOS, Mac, SaaS, AI and Web apps.",
});

export default function ExpiresSoonPage() {
  return <ExpiresSoonClient />;
}
