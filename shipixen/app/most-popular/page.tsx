'use client';
import React, { useMemo } from 'react';
import { allCoreContent } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import { PostItem } from '@/components/blog/home/PostItem';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { LandingPrimaryTextCtaSection } from '@/components/landing/cta/LandingPrimaryCta';
import { LandingDotParticleCtaBg } from '@/components/landing/cta-backgrounds/LandingDotParticleCtaBg';

export default function CategoryPage() {
  const sortedPosts = useMemo(() => {
    return allCoreContent(
      allBlogs.filter(
        (post) => post.leaderboardPosition && post.leaderboardPosition > 0,
      ),
    )
      .sort((a, b) => {
        if (a.leaderboardPosition && b.leaderboardPosition) {
          return a.leaderboardPosition - b.leaderboardPosition;
        }

        return 0;
      })
      .slice(0, 25);
  }, []);

  return (
    <div className="flex flex-col w-full items-center">
      <Header className="mb-0 lg:mb-0" />

      <LandingPrimaryTextCtaSection
        title="Top 25 Most Popular Deals"
        descriptionComponent={
          <p className="max-w-2xl">
            The community loves these! Here are the top 25 deals that got the
            most attention on Rare Big Deal so far.
          </p>
        }
        textPosition="center"
        className="relative bg-gray-200/60 dark:bg-gray-900"
        effectComponent={<LandingDotParticleCtaBg />}
      ></LandingPrimaryTextCtaSection>

      <section className="max-w-2xl 2xl:max-w-6xl w-full mt-12 p-6">
        <div className="flex flex-col w-full items-center justify-between">
          <div className="flex flex-col gap-4 w-full">
            <ul className={'grid gap-4'}>
              {sortedPosts.map((post) => (
                <PostItem key={post.slug} post={post} showImage={true} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
