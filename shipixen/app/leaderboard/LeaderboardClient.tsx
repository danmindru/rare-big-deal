'use client';

import { allCoreContent } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import { PostItem } from '@/components/blog/home/PostItem';
import Header from '@/components/shared/Header';
import { LandingPrimaryTextCtaSection } from '@/components/landing/cta/LandingPrimaryCta';
import { LandingDotParticleCtaBg } from '@/components/landing/cta-backgrounds/LandingDotParticleCtaBg';
import leaderboards from '@/data/leaderboards';
import leaderboardRank from '@/data/leaderboards/rank';

function viewLabel(count: number) {
  return count === 1 ? '1 view' : `${count} views`;
}

export default function LeaderboardClient() {
  const board = leaderboards.current;
  const description = `Most viewed deals on Rare Big Deal, based on site analytics, updated ${board.updatedLabel}.`;
  const { ranked } = leaderboardRank.rankDeals(
    allCoreContent(allBlogs),
    board.entries,
    {
      today: leaderboardRank.todayIsoDate(),
    },
  );
  const items = ranked.filter((item) => item.post);

  return (
    <div className="flex w-full flex-col items-center">
      <Header className="mb-0 lg:mb-0" />

      <LandingPrimaryTextCtaSection
        title="Most popular deals"
        descriptionComponent={<p className="max-w-2xl">{description}</p>}
        textPosition="center"
        className="relative bg-gray-200/60 dark:bg-gray-900"
        effectComponent={<LandingDotParticleCtaBg />}
      />

      <section className="mt-12 w-full max-w-2xl p-6 2xl:max-w-3xl">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            No current deals are on this leaderboard yet.
          </p>
        ) : (
          <ol className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.slug} className="flex items-stretch gap-3">
                <div className="flex w-14 shrink-0 flex-col items-center justify-center text-center">
                  <span className="text-lg font-semibold tabular-nums">
                    {item.rank}
                  </span>
                  <span className="text-[0.7rem] tabular-nums text-gray-500 dark:text-gray-400">
                    {viewLabel(item.count)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <PostItem post={item.post} showImage={true} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
