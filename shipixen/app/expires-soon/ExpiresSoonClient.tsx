'use client';
import React, { useMemo } from 'react';
import { allCoreContent } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import { PostItem } from '@/components/blog/home/PostItem';
import Header from '@/components/shared/Header';
import { LandingPrimaryTextCtaSection } from '@/components/landing/cta/LandingPrimaryCta';
import { LandingDotParticleCtaBg } from '@/components/landing/cta-backgrounds/LandingDotParticleCtaBg';
import { CoreContent } from '@shipixen/pliny/utils/contentlayer';
import { Blog } from 'shipixen-contentlayer/generated';

export default function ExpiresSoonClient() {
  const groupedPosts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fiveDaysFromNow = new Date(today);
    fiveDaysFromNow.setDate(today.getDate() + 5);
    fiveDaysFromNow.setHours(23, 59, 59, 999);

    // Filter and calculate days until expiration
    const postsWithDays = allCoreContent(
      allBlogs.filter((post) => {
        // Skip if no expiresOnDate or if it's "Never"
        if (!post.expiresOnDate || post.expiresOnDate === 'Never') {
          return false;
        }

        try {
          const expiresOn = new Date(post.expiresOnDate);
          expiresOn.setHours(0, 0, 0, 0);

          // Check if expiration date is within the next 5 days
          // and hasn't already passed
          return expiresOn >= today && expiresOn <= fiveDaysFromNow;
        } catch (error) {
          // Skip invalid dates
          return false;
        }
      }),
    ).map((post) => {
      let daysUntilExpiration = 0;
      try {
        if (post.expiresOnDate) {
          const expiresOn = new Date(post.expiresOnDate);
          expiresOn.setHours(0, 0, 0, 0);
          const diffTime = expiresOn.getTime() - today.getTime();
          daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
      } catch (error) {
        // Keep daysUntilExpiration as 0 if date parsing fails
      }

      return {
        post,
        daysUntilExpiration,
      };
    });

    // Group by days until expiration
    const groups: Record<number, CoreContent<Blog>[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    postsWithDays.forEach(({ post, daysUntilExpiration }) => {
      // Clamp days to 1-5 range
      const days = Math.max(1, Math.min(5, daysUntilExpiration));
      if (groups[days]) {
        groups[days].push(post);
      }
    });

    // Sort posts within each group by expiration date (soonest first)
    Object.keys(groups).forEach((days) => {
      groups[Number(days)].sort((a, b) => {
        if (a.expiresOnDate && b.expiresOnDate) {
          try {
            const dateA = new Date(a.expiresOnDate);
            const dateB = new Date(b.expiresOnDate);
            return dateA.getTime() - dateB.getTime();
          } catch (error) {
            return 0;
          }
        }
        return 0;
      });
    });

    return groups;
  }, []);

  const totalPosts = Object.values(groupedPosts).reduce(
    (sum, posts) => sum + posts.length,
    0,
  );

  return (
    <div className="flex flex-col w-full items-center">
      <Header className="mb-0 lg:mb-0" />

      <LandingPrimaryTextCtaSection
        title="Deals Expiring Soon"
        descriptionComponent={
          <p className="max-w-2xl">
            Don't miss out! These deals expire within the next 5 days. Grab
            these limited-time offers before they're gone.
          </p>
        }
        textPosition="center"
        className="relative bg-gray-200/60 dark:bg-gray-900"
        effectComponent={<LandingDotParticleCtaBg variant="danger" />}
      ></LandingPrimaryTextCtaSection>

      <section className="max-w-2xl 2xl:max-w-3xl w-full mt-12 p-6">
        <div className="flex flex-col w-full items-center justify-between">
          {totalPosts > 0 ? (
            <div className="flex flex-col gap-8 w-full">
              {[1, 2, 3, 4, 5].map((days) => {
                const posts = groupedPosts[days];
                if (posts.length === 0) return null;

                return (
                  <div key={days} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Expires in {days} {days === 1 ? 'day' : 'days'}
                    </h2>
                    <p className="-mt-4 text-sm text-gray-500 dark:text-gray-500">
                      {posts.length} {posts.length === 1 ? 'deal' : 'deals'}{' '}
                    </p>
                    <ul className="grid gap-4">
                      {posts.map((post) => (
                        <PostItem
                          key={post.slug}
                          post={post}
                          showImage={true}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No deals expiring soon at the moment.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Check back later for new limited-time offers!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
