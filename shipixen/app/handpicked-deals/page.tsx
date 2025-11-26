import Header from '@/components/shared/Header';
import { LandingPrimaryTextCtaSection } from '@/components/landing/cta/LandingPrimaryCta';
import { LandingSocialProof } from '@/components/landing/social-proof/LandingSocialProof';
import { Button } from '@/components/shared/ui/button';
import { Showcase } from '@/components/showcase/Showcase';
import { picksIndex } from '@/data/picks/index';
import stats from '@/data/stats';
import Link from 'next/link';
import bestApps from '@/data/picks/best-apps';
import { LandingShapesCtaBg } from '@/components/landing/cta-backgrounds/LandingShapesCtaBg';
import { genPageMetadata } from 'app/seo';

export const metadata = genPageMetadata({
  title: 'Best Deal Picks - Handpicked AI, Marketing & DevTool Deals',
  description:
    "We've handpicked the best AI, Marketing, and DevTool on iOS, Mac, SaaS, AI and Web apps that ever existed. Now with crazy discounts! Discover exclusive lifetime deals and limited-time offers.",
});

const avatars = [
  {
    imageSrc: '/static/images/people/13.png',
    name: 'Daniel Nguyen',
  },
  {
    imageSrc: '/static/images/people/1.png',
    name: 'Matthias',
  },
  {
    imageSrc: '/static/images/people/2.jpeg',
    name: 'Tropiano',
  },
  {
    imageSrc: '/static/images/people/4.jpeg',
    name: 'Catalin',
  },
  {
    imageSrc: '/static/images/people/14.png',
    name: 'Fekri',
  },
  {
    imageSrc: '/static/images/people/15.jpeg',
    name: 'Serg',
  },
];

const loadBundles = () => {
  return Promise.all(
    picksIndex.map(async (bundleName) => {
      const m = await import(`@/data/picks/${bundleName}`);
      return m.default;
    }),
  );
};

export default async function AllBundles() {
  const bundles = await loadBundles();
  const filteredBundles = bundles.filter(
    (bundle) => bundle.name !== 'Best Apps',
  );
  const users = stats.contributors || 0;

  return (
    <div className="flex flex-col w-full items-center fancy-overlay">
      <Header className="mb-0 lg:mb-0" />

      <LandingPrimaryTextCtaSection
        title="Best Deal Picks"
        descriptionComponent={
          <p className="max-w-2xl">
            We've handpicked the best AI, Marketing, DevTool apps that ever
            existed. Now with crazy discounts!
          </p>
        }
        textPosition="center"
        className="relative bg-gray-200/60 dark:bg-gray-900"
        effectComponent={<LandingShapesCtaBg variant="primary" />}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="xl" variant="primary" asChild>
              <Link href="/handpicked-deals">Best Deals</Link>
            </Button>

            <Button size="xl" variant="outlinePrimary">
              <Link href="/categories/developer-tools">All Categories</Link>
            </Button>
          </div>

          <div className="flex items-center">
            <LandingSocialProof
              className="w-full mt-12"
              showRating
              numberOfUsers={users}
              suffixText="happy users"
              avatarItems={avatars}
            />
          </div>
        </div>
      </LandingPrimaryTextCtaSection>

      <section className="max-w-3xl 2xl:max-w-3xl w-full mb-12">
        <Showcase
          key={'best-apps'}
          className="mt-8"
          bundle={bestApps}
          autoplayOnHover
          showAppList={true}
        />

        {filteredBundles.map((bundle, index) => (
          <Showcase
            key={index}
            className="mt-8"
            bundle={bundle}
            autoplayOnHover
            showAppList={true}
          />
        ))}
      </section>
    </div>
  );
}
