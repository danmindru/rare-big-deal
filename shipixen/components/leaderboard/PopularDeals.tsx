'use client';

import { allCoreContent } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import Link from '@/components/shared/Link';
import Image from '@/components/shared/Image';
import leaderboards from '@/data/leaderboards';
import leaderboardRank from '@/data/leaderboards/rank';
import { hashStringToColor } from '@/components/shared/util/hash-string-color';

const HOMEPAGE_LIMIT = 5;

function viewLabel(count: number) {
  return count === 1 ? '1 view' : `${count} views`;
}

export default function PopularDeals() {
  const board = leaderboards.current;
  const { ranked } = leaderboardRank.rankDeals(
    allCoreContent(allBlogs),
    board.entries,
    {
      today: leaderboardRank.todayIsoDate(),
    },
  );
  const items = ranked.slice(0, HOMEPAGE_LIMIT).filter((item) => item.post);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="popular-deals-heading"
      className="mt-8 w-full max-w-lg"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="popular-deals-heading" className="text-lg font-bold">
          <Link href="/leaderboard" className="hover:text-primary-500">
            Most viewed deals
          </Link>
        </h2>
        <Link
          href="/leaderboard"
          className="shrink-0 text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          Full list
        </Link>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Most viewed deals on Rare Big Deal, based on site analytics, updated{' '}
        {board.updatedLabel}.
      </p>
      <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((item) => {
          const post = item.post;
          const title = post.title?.trim() || item.slug;
          const tint = hashStringToColor(title);
          return (
            <li key={item.slug}>
              <Link
                href={`/products/${item.slug}`}
                className="flex items-center gap-3 py-2.5"
              >
                <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-gray-500 dark:text-gray-400">
                  {item.rank}
                </span>
                <figure className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white bg-white/50 dark:border-black dark:bg-black/50">
                  {post.logo ? (
                    <Image
                      src={post.logo}
                      alt=""
                      width={64}
                      height={64}
                      className="h-full w-full object-cover dark:bg-white/20"
                    />
                  ) : (
                    <span
                      className="block h-full w-full"
                      style={{ backgroundColor: tint }}
                    />
                  )}
                </figure>
                <span className="min-w-0 truncate text-sm">{title}</span>
                <span className="ml-auto shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  {viewLabel(item.count)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
