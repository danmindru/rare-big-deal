import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { slug as githubSlugger, slug as slugify } from 'github-slugger';
import { ExternalLinkIcon } from 'lucide-react';
import {
  CoreContent,
  allCoreContent,
} from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';

import type { Blog, Authors } from 'shipixen-contentlayer/generated';
import Link from '@/components/shared/Link';
import Header from '@/components/shared/Header';
import Image from '@/components/shared/Image';
import Tag from '@/components/blog/Tag';
import { siteConfig } from '@/data/config/site.settings';
import ScrollTop from '@/components/shared/ScrollTop';
import { hashStringToColor } from '@/components/shared/util/hash-string-color';
import clsx from 'clsx';
import { PostItem } from '@/components/blog/home/PostItem';
import { ProductCarousel } from '@/components/shared/ui/product-carousel';

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

interface LayoutProps {
  className?: string;
  content: CoreContent<Blog>;
  authorDetails: CoreContent<Authors>[];
  children: ReactNode;
}

const getRelevantDates = ({ validFromDate, expiresOnDate }) => {
  let isExpired = false;
  let isValid = true;
  let validFromFormattedDate: string | null = null;
  let expiresOnFormattedDate: string | null = null;
  let isValidInThreeDays = false;
  let isValidInOneDay = false;
  let expiresInADay = false;
  let expiresInThreeDays = false;

  try {
    const validFrom = validFromDate ? new Date(validFromDate) : null;
    const expiresOn = expiresOnDate ? new Date(expiresOnDate) : null;
    const today = new Date();

    if (validFrom) {
      const validityDays =
        (validFrom.getTime() - today.getTime()) / (1000 * 3600 * 24);
      validFromFormattedDate = validFrom.toLocaleDateString(
        siteConfig.locale,
        postDateTemplate,
      );

      isValidInOneDay = validityDays > 0 && validityDays <= 1;
      isValidInThreeDays =
        !isValidInOneDay && validityDays > 0 && validityDays <= 3;
    }

    if (expiresOn) {
      const expiryDays =
        (expiresOn.getTime() - today.getTime()) / (1000 * 3600 * 24);
      isExpired = today > new Date(expiresOn.setDate(expiresOn.getDate() + 1));

      expiresOnFormattedDate = expiresOn.toLocaleDateString(
        siteConfig.locale,
        postDateTemplate,
      );
      expiresInADay = expiryDays > 0 && expiryDays <= 1;
      expiresInThreeDays = !expiresInADay && expiryDays > 0 && expiryDays <= 3;
    }

    if (validFrom) {
      if (expiresOn) {
        isValid = today >= validFrom && today <= expiresOn;
      } else {
        isValid = today >= validFrom;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return {
    isExpired,
    isValid,
    validFromFormattedDate,
    expiresOnFormattedDate,
    isValidInThreeDays,
    isValidInOneDay,
    expiresInADay,
    expiresInThreeDays,
  };
};

export default function PostLayout({
  className,
  content,
  authorDetails,
  children,
}: LayoutProps) {
  const {
    path,
    slug,
    date,
    title,
    tags,
    logo,
    website,
    categories,
    subcategories,
    validFromDate,
    expiresOnDate,
    appCategory,
    appPrice,
    appPriceCurrency,
    appRating,
    appReviewCount,
    appOperatingSystem,
    appAvailableOnDevice,
    appAuthorName,
    appAuthorUrl,
  } = content;
  const images = content.images || [];
  const firstImage = images[0];
  const hasMultipleImages = images.length > 1;
  const tintColor = hashStringToColor(title);
  const fallbackImage = '/static/images/fallback.png';

  // Check if we have app store data
  const hasAppStoreData = !!(
    appRating ||
    appPrice !== undefined ||
    appOperatingSystem ||
    appAvailableOnDevice ||
    appAuthorName
  );

  const {
    isExpired,
    isValid,
    validFromFormattedDate,
    expiresOnFormattedDate,
    isValidInThreeDays,
    isValidInOneDay,
    expiresInADay,
    expiresInThreeDays,
  } = getRelevantDates({
    validFromDate,
    expiresOnDate,
  });

  const allProducts = allCoreContent(allBlogs);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const getRecommendedProducts = () => {
    // Get top 20 ranked products (excluding current)
    const topProducts = allProducts
      .filter(
        (product) =>
          product.slug !== slug &&
          product.leaderboardPosition &&
          product.leaderboardPosition > 0 &&
          product.leaderboardPosition <= 20,
      )
      .sort(
        (a, b) =>
          (a.leaderboardPosition || 999) - (b.leaderboardPosition || 999),
      );

    // Randomly select 3 from top 20
    const selectedTopProducts = shuffleArray([...topProducts]).slice(0, 3);

    // Get category matches (excluding current and selected top products)
    const sameCategoryProducts = allProducts.filter(
      (product) =>
        product.slug !== slug &&
        !selectedTopProducts.find((p) => p.slug === product.slug) &&
        product.categories &&
        product.categories.some((cat) => categories?.includes(cat)),
    );

    // Get other products for remaining spots
    const otherProducts = allProducts.filter(
      (product) =>
        product.slug !== slug &&
        !selectedTopProducts.find((p) => p.slug === product.slug) &&
        !sameCategoryProducts.find((p) => p.slug === product.slug),
    );

    // Fill remaining spots with category matches and others
    const remainingCount = 15 - selectedTopProducts.length;
    const shuffledRemainder = shuffleArray([
      ...sameCategoryProducts.slice(0, 10),
      ...otherProducts,
    ]).slice(0, remainingCount);

    return [...selectedTopProducts, ...shuffledRemainder];
  };

  const recommendedProducts = getRecommendedProducts();

  return (
    <div className="flex flex-col w-full items-center">
      <Header containerClassName="!bg-transparent dark:!bg-transparent" />

      <div
        className={cn(
          'flex p-6 items-center fancy-overlay fancy-overlay--muted',
          className,
        )}
      >
        <ScrollTop />
        <article className="container-narrow">
          <header className="pt-6 -mt-6 lg:-mt-8">
            <div className="space-y-1 text-center">
              <div className="flex flex-col items-center group">
                <div className="flex gap-4 w-auto bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-xl py-3 px-6 items-center relative z-10 shadow-md group-hover:-translate-y-3 md:group-hover:-translate-y-5 transition-all duration-300 ease-in-out ">
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

                  <figure
                    className={clsx(
                      'w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-[20px] overflow-hidden bg-white/50 dark:bg-black/50',
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
                  <h1 className="text-xl md:text-2xl lg:text-4xl font-light">
                    {title}
                  </h1>
                </div>

                {hasMultipleImages ? (
                  <ProductCarousel images={images} title={title} />
                ) : (
                  firstImage && (
                    <Image
                      src={firstImage}
                      alt={title}
                      width={1240}
                      height={640}
                      className="bg-white rounded-t-lg w-full h-auto relative -mt-12 -z-10"
                    />
                  )
                )}
              </div>
            </div>

            {validFromFormattedDate || expiresOnFormattedDate ? (
              <div
                className={clsx(
                  'flex flex-wrap justify-center gap-4 text-xs md:text-sm leading-5',
                  isExpired || expiresInADay || expiresInThreeDays
                    ? 'bg-red-300 dark:bg-red-800'
                    : '',
                  !isExpired ? 'bg-green-300 dark:bg-green-800' : '',
                )}
              >
                {!isValid && !isExpired && validFromFormattedDate ? (
                  <div className="p-2 md:p-4">
                    <span>Deal Starts</span>{' '}
                    {isValidInOneDay && (
                      <span className="font-semibold underline underline-offset-2">
                        in about 1 day,
                      </span>
                    )}{' '}
                    <time dateTime={validFromDate}>
                      on {validFromFormattedDate}
                    </time>
                  </div>
                ) : null}

                {!isExpired && (expiresInADay || expiresInThreeDays) && (
                  <div className="p-2 md:p-4">
                    <span>Deal Ends</span>{' '}
                    {expiresInADay && (
                      <span className="font-semibold underline underline-offset-2">
                        in less than 1 day
                      </span>
                    )}{' '}
                    {expiresInThreeDays && (
                      <span className="font-semibold underline underline-offset-2">
                        in less than 3 days
                      </span>
                    )}{' '}
                  </div>
                )}

                {isExpired && (
                  <div className="p-2 md:p-4">
                    <span>Deal Expired</span>{' '}
                    <time dateTime={expiresOnDate}>
                      on {expiresOnFormattedDate}
                    </time>
                  </div>
                )}
              </div>
            ) : null}
          </header>

          <div className="container-narrow">
            <div className="lg:bg-white dark:lg:bg-slate-900 lg:px-10 lg:py-4 divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 items-center"
                >
                  <h2 className="text-3xl m-0 p-0">{title} website</h2>
                  <ExternalLinkIcon className="w-6 h-6" />
                </a>
                {children}
              </div>
            </div>

            {/* App Store Information */}
            {hasAppStoreData && (
              <div className="mt-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 hard-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appRating !== null && appRating !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-xs tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                        Rating
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold">
                          {appRating.toFixed(1)}
                        </span>
                        <span className="text-yellow-500">★</span>
                        {appReviewCount !== null &&
                          appReviewCount !== undefined && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({appReviewCount.toLocaleString()} reviews)
                            </span>
                          )}
                      </div>
                    </div>
                  )}

                  {appPrice !== undefined && appPrice !== null && (
                    <div className="flex flex-col">
                      <span className="text-xs tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                        Price
                      </span>
                      <span className="text-2xl font-semibold">
                        {appPrice === 0 ? (
                          'Free'
                        ) : (
                          <>
                            {appPriceCurrency && appPriceCurrency !== 'USD'
                              ? `${appPriceCurrency} `
                              : '$'}
                            {appPrice.toFixed(2)}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                  {/*
                      {appCategory && (
                        <div className="flex flex-col">
                          <span className="text-xs tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                            Category
                          </span>
                          <span className="text-lg font-medium">
                            {appCategory}
                          </span>
                        </div>
                      )} */}

                  {appAvailableOnDevice && (
                    <div className="flex flex-col">
                      <span className="text-xs tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                        Available On
                      </span>
                      <span className="text-sm">{appAvailableOnDevice}</span>
                    </div>
                  )}

                  {appOperatingSystem && (
                    <div className="flex flex-col">
                      <span className="text-xs tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                        Requirements
                      </span>
                      <span className="text-sm">{appOperatingSystem}</span>
                    </div>
                  )}

                  {appAuthorName && (
                    <div className="flex flex-col">
                      <span className="text-xs tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                        Developer
                      </span>
                      {appAuthorUrl ? (
                        <a
                          href={appAuthorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 underline"
                        >
                          {appAuthorName}
                        </a>
                      ) : (
                        <span className="text-sm">{appAuthorName}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(categories || subcategories) && (
            <div className="-mt-4 -mr-4 flex flex-wrap gap-4 lg:justify-end relative z-10">
              {categories &&
                categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${slugify(category)}`}
                    className="px-3 py-2 text-sm font-medium text-white dark:text-black bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-400"
                  >
                    {category}
                  </Link>
                ))}
            </div>
          )}

          <section>
            <div className="mt-6 divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
              {tags && (
                <div className="py-4 xl:py-8">
                  <h2 className="text-xs tracking-wide text-gray-500 dark:text-gray-400">
                    Tags
                  </h2>
                  <div className="flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                  <a
                    href="/tags"
                    className="inline-block mt-2 text-xs capitalize font-medium text-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    All tags
                    <ExternalLinkIcon className="ml-1 inline-block w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="py-4 xl:py-8">
                <h2 className="text-xs tracking-wide text-gray-500 dark:text-gray-400">
                  Recommended Products
                </h2>
                <div className="flex flex-wrap">
                  {recommendedProducts.map((product) => (
                    <div key={product.slug} className="w-full p-2">
                      <PostItem post={product} showImage={true} />{' '}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 xl:pt-8">
                {categories && categories.length > 0 && (
                  <Link
                    href={'/categories/' + slugify(categories[0])}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`More ${categories[0]} Deals`}
                  >
                    More deals in {categories[0]} ✨
                  </Link>
                )}
                <Link
                  href={siteConfig.categoriesPath}
                  className="ml-auto text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={'All Deals'}
                >
                  All Deals &rarr;
                </Link>
              </div>
            </div>
          </section>

          <section>
            <p className="mt-8 text-sm font-medium leading-5 text-gray-500 dark:text-gray-400">
              This product was categorized under
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              {categories &&
                categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${slugify(category)}`}
                    className="px-3 py-2 text-sm font-medium text-white dark:text-black bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-400"
                  >
                    {category}
                  </Link>
                ))}
            </div>

            <p className="mt-8 text-sm font-medium leading-5 text-gray-500 dark:text-gray-400">
              And under the following subcategories
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              {subcategories &&
                subcategories.map((subcategory) => (
                  <span
                    key={subcategory}
                    className="px-3 py-2 text-sm font-medium text-white dark:text-black bg-primary-500 grayscale"
                  >
                    {subcategory}
                  </span>
                ))}
            </div>
          </section>

          <footer className="mt-8">
            <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li
                      className="flex items-center space-x-2"
                      key={author.name}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">
                          {author.name}
                        </dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter.replace(
                                'https://twitter.com/',
                                '@',
                              )}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>

              <dt className="text-xs mt-8">Published on</dt>
              <dd className="text-xs font-medium leading-6 text-gray-500 dark:text-gray-400">
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString(
                    siteConfig.locale,
                    postDateTemplate,
                  )}
                </time>
              </dd>
            </dl>
          </footer>
        </article>
      </div>
    </div>
  );
}
