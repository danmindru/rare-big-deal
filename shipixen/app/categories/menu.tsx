'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from '@/components/shared/Link';
import { slug } from 'github-slugger';
import {
  sortPosts,
  allCoreContent,
  CoreContent,
} from '@shipixen/pliny/utils/contentlayer';
import { allBlogs, Blog } from 'shipixen-contentlayer/generated';
import clsx from 'clsx';

const categoryEmojis: Record<string, string> = {
  Productivity: '💼',
  'Boilerplates, Startup SaaS/Tools': '🚀',
  'Boilerplates, Starters & Libraries': '🚀',
  'AI Tools': '🤖',
  'Marketing Tools': '📈',
  'Marketing': '📈',
  'Design Tools': '🎨',
  'Developer Tools': '💻',
  'SEO Tools': '🔍',
  Courses: '📚',
  'Health and Fitness': '🏋️‍♂️',
  'Other AI tools': '🧠',
  'Themes, Plugins': '🎛️',
  'Data Tools': '📊',
  Books: '📖',
  Learning: '🎓',
  Finance: '💰',
  'tvOS Apps': '📺',
  'iOS Apps': '📱',
  'Code Libraries': '📂',
  'Video Tools': '🎥',
  'MacOS Apps': '🖥️',

};

export const Menu = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const categoryFromPath = pathname?.split('/').pop();
    if (categoryFromPath) {
      setSelectedCategory(categoryFromPath);
    }
  }, [pathname]);

  const sortedPosts = sortPosts(allBlogs);
  const posts = allCoreContent(sortedPosts); // not unique
  const categories = useMemo(() => {
    const categoryMap = {};
    posts.forEach((post) => {
      (post.categories || []).forEach((category) => {
        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }
        categoryMap[category].push(post);
      });
    });
    return categoryMap;
  }, [posts]);

  // Categories by number of posts
  const sortedCategories = Object.keys(categories).sort(
    (a, b) => categories[b].length - categories[a].length,
  );

  return (
    <aside
      className={clsx(
        'flex flex-col bg-purple-100/20 dark:bg-purple-950/30 rounded-lg',
        className,
      )}
    >
      <h1 className="opacity-50 text-xs p-4 font-normal font-sans">
        All discount categories
      </h1>
      <ul className="flex flex-col gap-1 p-2">
        {sortedCategories.map((category) => {
          const emoji = categoryEmojis[category] || '✨';
          const isSelected = selectedCategory === slug(category);
          return (
            <li key={category} className="mb-2">
              <Link
                href={`/categories/${slug(category)}`}
                className={clsx(
                  'rounded-lg px-4 py-2 flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100',
                  {
                    'bg-primary-500/10': isSelected,
                    'text-black dark:text-gray-300 hover:bg-primary-500/5':
                      !isSelected,
                  },
                )}
                onClick={() => setSelectedCategory(slug(category))}
              >
                <span>
                  {emoji} {category}
                </span>
                <span
                  className={clsx('rounded-full px-2 py-1 text-xs', {
                    'bg-primary-500 text-white': isSelected,
                    'bg-purple-200 text-black dark:bg-gray-800 dark:text-gray-300':
                      !isSelected,
                  })}
                >
                  {categories[category].length}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="opacity-50 text-xs p-4 font-normal font-sans mt-auto">
        Viewing deals & discounts in the{' '}
        <strong>
          {selectedCategory
            ?.split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </strong>{' '}
        category.
      </p>
    </aside>
  );
};
