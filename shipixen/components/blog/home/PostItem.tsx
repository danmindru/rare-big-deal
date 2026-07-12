'use client';
import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { Blog } from 'shipixen-contentlayer/generated';
import Image from '@/components/shared/Image';
import { InteractiveStatCard } from '@/components/shared/InteractiveStatCard';
import { StatCardButtonHoverComponent } from '@/components/shared/StatCardButtonHoverComponent';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { CoreContent } from '@shipixen/pliny/utils/contentlayer';
import { hashStringToColor } from '@/components/shared/util/hash-string-color';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shared/ui/tooltip';

function processTitle(title: string): string {
  const delimiters = [':', ',', '.', '-'];
  const exceptions = ['St.', 'Inc.', 'Ltd.'];

  for (const delimiter of delimiters) {
    const index = title.indexOf(delimiter);
    if (index !== -1) {
      // Check if this delimiter is part of an exception
      const isException = exceptions.some((exception) => {
        const exceptionIndex = title.indexOf(exception);
        if (exceptionIndex === -1) return false;
        // Check if the delimiter is within the exception boundaries
        return (
          index >= exceptionIndex && index < exceptionIndex + exception.length
        );
      });

      if (!isException) {
        title = title.substring(0, index);
        break; // Stop after first valid delimiter
      }
    }
  }

  const words = title.split(' ').slice(0, 4);
  return words.join(' ');
}

function checkIfExpired(expiresOnDate: string | null | undefined): boolean {
  // Skip if no expiresOnDate or if it's "Never"
  if (!expiresOnDate || expiresOnDate === 'Never') {
    return false;
  }

  try {
    const expiresOn = new Date(expiresOnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiresOn.setHours(0, 0, 0, 0);

    // Check if expiration date has passed (expiresOn is before today)
    return expiresOn < today;
  } catch (error) {
    // Fallback gracefully - if date parsing fails, assume not expired
    return false;
  }
}

export function PostItem({
  post,
  showImage,
}: {
  post: CoreContent<Blog>;
  showImage: boolean;
}) {
  const {
    path,
    slug,
    date,
    title,
    summary,
    tags,
    images,
    logo,
    deal,
    website,
    leaderboardPosition,
    expiresOnDate,
  } = post;
  const firstImage = images?.[0];
  const [showDescription, setShowDescription] = useState(false);
  const fallbackImage = '/static/images/fallback.png';
  const tintColor = hashStringToColor(title);
  const processedTitle = processTitle(title);

  const isExpired = useMemo(
    () => checkIfExpired(expiresOnDate),
    [expiresOnDate],
  );

  const dealText = useMemo(() => {
    if (!deal) return '';
    return isExpired ? `(expired)` : deal;
  }, [deal, isExpired]);

  return (
    <InteractiveStatCard
      href={`/products/${slug}`}
      disabled={false}
      hoverComponent={
        <StatCardButtonHoverComponent
          subtitle={
            `${summary?.slice(0, 60)}${
              summary?.length && summary?.length > 60 ? '...' : ''
            }` || 'Read more'
          }
        />
      }
      bgBlurStrength="none"
      shadowStrength="none"
      className={clsx(
        'group !py-1 !bg-white-100/80 dark:!bg-black/50 !min-h-0',
        isExpired
          ? '!border-1 !border-solid !border-gray-300 dark:!border-gray-800'
          : '!border-none',
      )}
    >
      <div className="w-full px-3 py-1">
        {!isExpired ? (
          <>
            {leaderboardPosition &&
            leaderboardPosition > 0 &&
            leaderboardPosition <= 25 ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = '/most-popular';
                    }}
                    className={clsx(
                      'flex hover:opacity-70 transition-opacity cursor-pointer',
                      leaderboardPosition === 1 && 'ribbon-gold',
                      leaderboardPosition === 2 && 'ribbon-silver',
                      leaderboardPosition === 3 && 'ribbon-bronze',
                      leaderboardPosition > 3 && 'ribbon-default',
                    )}
                  >
                    #{leaderboardPosition}
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={-10}>
                  <p>The top {leaderboardPosition} most popular product</p>
                </TooltipContent>
              </Tooltip>
            ) : null}{' '}
          </>
        ) : null}

        {!isExpired ? (
          <>
            {logo ? (
              <Image
                aria-hidden="true"
                className="absolute w-full h-full left-0 top-0 -z-100 opacity-20 dark:opacity-20 saturate-200 dark:saturate-[3] blur-2xl bg-cover"
                src={logo}
                alt={title}
                width={200}
                height={200}
              />
            ) : (
              <div
                className="absolute w-full h-full left-0 top-0 -z-100 opacity-20 dark:opacity-20 saturate-200 dark:saturate-[3] blur-2xl bg-cover"
                style={{
                  backgroundImage: `url(${fallbackImage})`,
                  backgroundColor: tintColor,
                }}
              />
            )}
          </>
        ) : null}

        <section
          className={clsx(
            'w-full flex flex-wrap sm:flex-nowrap items-center gap-2',
          )}
        >
          <div
            className={cn(
              'flex gap-2 items-center truncate',
              isExpired && 'grayscale',
            )}
          >
            <figure
              className={clsx(
                'w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden bg-white/50 dark:bg-black/50 border-1 border-solid border-white dark:border-black',
              )}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt="Product Thumbnail"
                  width={200}
                  height={200}
                  className="dark:bg-white/20"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${fallbackImage})`,
                    backgroundColor: tintColor,
                  }}
                />
              )}
            </figure>

            <div className="w-full h-full flex flex-col justify-between gap-1 dark:text-slate-300 truncate flex-shrink-0">
              <p className="text-xs sm:text-sm truncate">{processedTitle}</p>
            </div>
          </div>

          <div className="ml-auto w-full sm:w-auto flex-shrink flex gap-2 tabular-nums max-w-sm text-left sm:text-right pr-2">
            <span className="flex-col flex gap-1 items-center text-[0.7rem] sm:text-xs p-2 min-w-[40px]">
              <ReactMarkdown
                className={cn(
                  'text-gray-900 dark:text-gray-100',
                  isExpired && 'text-red-600 dark:text-red-400',
                )}
                disallowedElements={['a']}
              >
                {dealText}
              </ReactMarkdown>
            </span>
          </div>
        </section>
      </div>
    </InteractiveStatCard>
  );
}
