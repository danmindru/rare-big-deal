'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { slug } from 'github-slugger';
import { allCoreContent } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import Link from '@/components/shared/Link';
import { CategorySection } from '@/components/blog/HomeList';

const MAX_DISPLAY = 1000;

export default function CategoryClient({ category }: { category: string }) {
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    Record<string, string[]>
  >({});

  const sortedPosts = useMemo(() => {
    return allCoreContent(
      allBlogs.filter(
        (post) =>
          post.categories &&
          post.categories.some((cat) => slug(cat) === category),
      ),
    );
  }, [category]);

  const totalNumberOfPosts = sortedPosts.length;
  const numberOfPostsForSelectedCategory = sortedPosts.filter(
    (post) =>
      (post.subcategories &&
        post.subcategories.some((subcat) =>
          selectedSubcategories[category]?.includes(subcat),
        )) ||
      !selectedSubcategories[category],
  ).length;

  const toggleSubcategory = useCallback(
    (category: string, subcategory: string) => {
      const nextSelectedSubcategories = { ...selectedSubcategories };
      const selectedSubcategoriesForCategory =
        nextSelectedSubcategories[category] || [];
      const index = selectedSubcategoriesForCategory.indexOf(subcategory);
      if (index === -1) {
        selectedSubcategoriesForCategory.push(subcategory);
      } else {
        selectedSubcategoriesForCategory.splice(index, 1);
      }
      nextSelectedSubcategories[category] = selectedSubcategoriesForCategory;
      setSelectedSubcategories(nextSelectedSubcategories);
    },
    [selectedSubcategories],
  );

  return (
    <div className="flex flex-col w-full items-center justify-between">
      <div className="flex flex-col gap-4 w-full">
        <CategorySection
          category={category}
          posts={sortedPosts}
          selectedSubcategories={selectedSubcategories[category] || []}
          handleSubcategoryFilter={toggleSubcategory}
          numberOfPosts={MAX_DISPLAY}
          showImage={true}
          overrideClassName="flex flex-col gap-4"
          showTitle={false}
          categoryClassName="mb-0"
        />

        {totalNumberOfPosts > MAX_DISPLAY && (
          <div className="mt-12 flex text-base font-medium leading-6">
            <Link
              href="/all-articles"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="See all deals"
            >
              See all deals &rarr;
            </Link>
          </div>
        )}

        <footer className="mt-2 mb-6 opacity-50 text-xs flex items-center">
          {numberOfPostsForSelectedCategory} total deals in
          <strong className="ml-3">
            {category
              ?.split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </strong>
        </footer>
      </div>
    </div>
  );
}
