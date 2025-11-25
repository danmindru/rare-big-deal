'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { slug } from 'github-slugger';
import { usePathname } from 'next/navigation';
import Link from '@/components/shared/Link';
import { siteConfig } from '@/data/config/site.settings';
import NewsletterForm from '@shipixen/pliny/ui/NewsletterForm';
import {
  sortPosts,
  allCoreContent,
  CoreContent,
} from '@shipixen/pliny/utils/contentlayer';
import { allBlogs, Blog } from 'shipixen-contentlayer/generated';
import { PostItem } from '@/components/blog/home/PostItem';
import CopyToClipboardButton from '@/components/shared/CopyToClipboardButton';
import { Showcase } from '@/components/showcase/Showcase';
import shipApps from '@/data/picks/ship-apps';
import nicheApps from '@/data/picks/niche-apps';
import marketingApps from '@/data/picks/marketing-apps';
import developerTools from '@/data/picks/developer-tools';
import aiApps from '@/data/picks/ai-apps';
import macApps from '@/data/picks/mac-apps';
import iosApps from '@/data/picks/ios-apps';
import theJohnApps from '@/data/picks/the-john-apps';
import boilerplates from '@/data/picks/boilerplates';
import { Button } from '@/components/shared/ui/button';
import { cn } from '@/lib/utils';

const MAX_DISPLAY = 1000;

export default function HomeList({
  numberOfPosts = MAX_DISPLAY,
  showImage = true,
}: {
  numberOfPosts?: number;
  showImage?: boolean;
}) {
  const pathname = usePathname();
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    Record<string, string[]>
  >({});
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [scrolledToCategory, setScrolledToCategory] = useState<boolean>(false);

  useEffect(() => {
    if (!scrolledToCategory) {
      const hashParams = new URLSearchParams(
        window.location.hash.replace('#', ''),
      );
      const category = hashParams.get('category');
      const subcategories = Object.fromEntries(
        Array.from(hashParams.entries()).filter(([key]) => key !== 'category'),
      );

      if (category) {
        setCurrentCategory(category);
        setSelectedSubcategories((prevSelected) => ({
          ...prevSelected,
          ...Object.keys(subcategories).reduce(
            (acc, key) => {
              acc[key] = JSON.parse(subcategories[key]);
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        }));

        const element = document.getElementById(category);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }

        setScrolledToCategory(true);
      }
    }
  }, [scrolledToCategory]);

  const sortedPosts = sortPosts(allBlogs);
  const posts = allCoreContent(sortedPosts); // not unique
  const totalNumberOfUniquePosts = useMemo(
    () =>
      posts.reduce((acc, post) => {
        if (!acc[post.slug]) {
          acc++;
          return acc;
        }
        return acc;
      }, 0),
    [posts],
  );

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

  const sortedCategories = useMemo(() => {
    const priorityCategories = [
      'AI Tools',
      'Developer Tools',
      'iOS Apps',
      'MacOS Apps',
      'Boilerplates, Starters & Libraries',
      'Marketing',
    ];
    const otherCategories = Object.keys(categories)
      .filter((category) => !priorityCategories.includes(category))
      .sort();
    return [...priorityCategories, ...otherCategories];
  }, [categories]);

  const toggleSubcategory = (category: string, subcategory: string) => {
    setSelectedSubcategories((prevSelected) => {
      const newSelected = { ...prevSelected };

      if (!newSelected[category]) {
        newSelected[category] = [];
      }
      if (newSelected[category].includes(subcategory)) {
        newSelected[category] = newSelected[category].filter(
          (item) => item !== subcategory,
        );
      } else {
        newSelected[category].push(subcategory);
      }

      const query = new URLSearchParams(window.location.hash.replace('#', ''));
      query.set('category', category);
      Object.keys(newSelected).forEach((cat) => {
        if (newSelected[cat].length > 0) {
          query.set(cat, JSON.stringify(newSelected[cat]));
        } else {
          query.delete(cat);
        }
      });
      window.history.replaceState(null, '', `${pathname}#${query.toString()}`);

      return newSelected;
    });
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.hash.replace('#', ''));
    if (currentCategory) {
      query.set('category', currentCategory);
      Object.keys(selectedSubcategories).forEach((cat) => {
        if (selectedSubcategories[cat].length > 0) {
          query.set(cat, JSON.stringify(selectedSubcategories[cat]));
        } else {
          query.delete(cat);
        }
      });
      window.history.replaceState(null, '', `${pathname}#${query.toString()}`);
    }
  }, [selectedSubcategories, currentCategory, pathname]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentCategory(entry.target.id);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    sortedCategories.forEach((category) => {
      const element = document.getElementById(category);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sortedCategories, handleIntersection]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {sortedCategories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            posts={categories[category]}
            selectedSubcategories={selectedSubcategories[category] || []}
            handleSubcategoryFilter={toggleSubcategory}
            numberOfPosts={numberOfPosts}
            showImage={showImage}
            showCaseClass="mt-4"
            hideCarousels={[]}
          />
        ))}

        {totalNumberOfUniquePosts > MAX_DISPLAY && (
          <div className="mt-12 flex text-base font-medium leading-6">
            <Link
              href={siteConfig.allArticlesPath}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="See all deals"
            >
              See all deals &rarr;
            </Link>
          </div>
        )}

        <footer className="opacity-50 text-xs flex items-center">
          {totalNumberOfUniquePosts} total deals
        </footer>

        {siteConfig.newsletter?.provider && (
          <div className="flex items-center justify-center pt-4">
            <NewsletterForm />
          </div>
        )}
      </div>
    </>
  );
}

export function CategorySection({
  category,
  posts,
  selectedSubcategories,
  handleSubcategoryFilter,
  numberOfPosts,
  showImage,
  overrideClassName,
  categoryClassName,
  showTitle = true,
  showCaseClass = '',
  hideCarousels = [],
}: {
  category: string;
  posts: CoreContent<Blog>[];
  selectedSubcategories: string[];
  handleSubcategoryFilter: (category: string, subcategory: string) => void;
  numberOfPosts: number;
  showImage: boolean;
  overrideClassName?: string;
  categoryClassName?: string;
  showTitle?: boolean;
  showCaseClass?: string;
  hideCarousels?: string[];
}) {
  const [textToCopy, setTextToCopy] = useState<string>(category);

  const sortedPosts =
    posts?.sort((a, b) => a.title.localeCompare(b.title)) || [];

  useEffect(() => {
    setTextToCopy(
      `${window.location.origin}${window.location.pathname}#category=${category}`,
    );
  }, [category]);

  return (
    <>
      {slug(category) === slug('Boilerplates, Starters & Libraries') &&
      !hideCarousels.includes('Boilerplates, Starters & Libraries') ? (
        <Showcase className={showCaseClass} bundle={boilerplates} />
      ) : null}

      {slug(category) === slug('Learning') &&
      !hideCarousels.includes('Learning') ? (
        <Showcase className={showCaseClass} bundle={nicheApps} />
      ) : null}

      {slug(category) === slug('Marketing') &&
      !hideCarousels.includes('Marketing') ? (
        <Showcase className={showCaseClass} bundle={marketingApps} />
      ) : null}

      {slug(category) === slug('Developer Tools') &&
      !hideCarousels.includes('Developer Tools') ? (
        <Showcase className={showCaseClass} bundle={developerTools} />
      ) : null}

      {slug(category) === slug('AI Tools') &&
      !hideCarousels.includes('AI Tools') ? (
        <Showcase bundle={aiApps} />
      ) : null}

      {slug(category) === slug('MacOS Apps') &&
      !hideCarousels.includes('MacOS Apps') ? (
        <Showcase bundle={macApps} />
      ) : null}

      {slug(category) === slug('iOS Apps') &&
      !hideCarousels.includes('iOS Apps') ? (
        <Showcase bundle={iosApps} />
      ) : null}

      {slug(category) === slug('John Rush Extravaganza') &&
      !hideCarousels.includes('John Rush Extravaganza') ? (
        <Showcase bundle={theJohnApps} />
      ) : null}

      <div className={cn('mb-8', categoryClassName)} id={category}>
        {showTitle ? (
          <div className="flex items-center mb-4 relative">
            <CopyToClipboardButton
              textToCopy={textToCopy}
              label={category}
              ariaLabel={`Set category to ${category}`}
            />
          </div>
        ) : null}

        <SubcategoryFilter
          category={category}
          posts={sortedPosts}
          selectedSubcategories={selectedSubcategories}
          handleSubcategoryFilter={handleSubcategoryFilter}
        />

        <ul className={overrideClassName || 'grid 2xl:grid-cols-2 gap-4'}>
          {sortedPosts
            .filter((post) => {
              return (
                !selectedSubcategories.length ||
                (post.subcategories &&
                  post.subcategories.some((subcategory) =>
                    selectedSubcategories.includes(subcategory),
                  ))
              );
            })
            .slice(0, numberOfPosts)
            .map((post) => (
              <PostItem key={post.slug} post={post} showImage={showImage} />
            ))}

          {sortedPosts.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">
                No deals in this category yet 🫣.
                <br />
                Be the first to submit one!
              </p>

              <div>
                <Button size={'sm'} variant={'outlinePrimary'} asChild>
                  <a
                    href="https://github.com/danmindru/rare-big-deal/issues/130"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Submit a deal
                  </a>
                </Button>
              </div>
            </div>
          )}
        </ul>
      </div>
    </>
  );
}

export function SubcategoryFilter({
  category,
  posts,
  selectedSubcategories,
  handleSubcategoryFilter,
}: {
  category: string;
  posts: CoreContent<Blog>[];
  selectedSubcategories: string[];
  handleSubcategoryFilter: (category: string, subcategory: string) => void;
}) {
  const subcategoryCounts = useMemo(() => {
    const countMap = posts.reduce(
      (acc, post) => {
        (post.subcategories || []).forEach((subcategory) => {
          acc[subcategory] = (acc[subcategory] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map(([subcategory, count]) => ({ subcategory, count }));
  }, [posts]);

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
      {subcategoryCounts.map(({ subcategory, count }) => (
        <button
          key={subcategory}
          onClick={() => handleSubcategoryFilter(category, subcategory)}
          className={`flex-shrink-0 text-xs px-4 py-2 rounded transition-colors font-display ${
            selectedSubcategories.includes(subcategory)
              ? 'bg-primary-500 text-white'
              : 'bg-primary-100/30 text-purple-700/80 dark:bg-primary-800/20 dark:text-white'
          }`}
        >
          {subcategory} ({count})
        </button>
      ))}
    </div>
  );
}
