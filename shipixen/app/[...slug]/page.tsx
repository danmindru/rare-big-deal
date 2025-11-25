import 'css/prism.css';
import 'katex/dist/katex.css';
import Link from 'next/link';
import { Metadata } from 'next';
import clsx from 'clsx';

import PageTitle from '@/components/shared/PageTitle';
import { components } from '@/components/MDXComponents';
import { MDXLayoutRenderer } from '@shipixen/pliny/mdx-components';
import {
  sortPosts,
  coreContent,
  allCoreContent,
} from '@shipixen/pliny/utils/contentlayer';
import { allBlogs, allAuthors } from 'shipixen-contentlayer/generated';
import type { Authors, Blog } from 'shipixen-contentlayer/generated';
import { Button } from '@/components/shared/ui/button';
import Header from '@/components/shared/Header';
import PostSimple from '@/layouts/PostSimple';
import PostLayout from '@/layouts/PostLayout';
import PostBanner from '@/layouts/PostBanner';
import ProductLayout from '@/layouts/ProductLayout';
import { PostItem } from '@/components/blog/home/PostItem';
import Image from '@/components/shared/Image';
import { hashStringToColor } from '@/components/shared/util/hash-string-color';

import { siteConfig } from '@/data/config/site.settings';
import { Separator } from '@/components/shared/ui/separator';

const productOverrides = require('@/data/config/product-overrides.js');

const BLOG_URL = siteConfig.blogPath ? `/${siteConfig.blogPath}` : '';

const defaultLayout = 'PostLayout';
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
  ProductLayout,
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata | undefined> {
  const path = BLOG_URL + decodeURI(params.slug.join('/'));
  const post = allBlogs.find((p) => p.path === path);
  const authorList = post?.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Authors);
  });
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = authorDetails.map((author) => author.name);
  let imageList = [siteConfig.socialBanner];
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteConfig.siteUrl + img,
    };
  });

  const seoTitle = `${post.title} | Rare Deals, Black Friday, Cyber Monday, Lifetime Deals, and more.`;

  const seoDescription = post.summary
    ? `${post.summary}. ${post.title} Rare Deals, Discounts, and Coupons.`
    : siteConfig.description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      siteName: siteConfig.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteConfig.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: imageList,
    },
    ...(post.canonicalUrl
      ? {
          alternates: {
            canonical: post.canonicalUrl,
          },
        }
      : {}),
  };
}

export const generateStaticParams = async () => {
  const paths = allBlogs.map((p) => ({ slug: p.path.split('/') }));
  return paths;
};

export default async function Page({ params }: { params: { slug: string[] } }) {
  const path = decodeURI(params.slug.join('/'));
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs));
  const postIndex = sortedCoreContents.findIndex((p) => p.path === path);
  if (postIndex === -1) {
    // Extract slug from path - handle both /products/slug and just slug
    const slug = path.replace(/^products\//, '').split('/')[0];

    // Look up product info from overrides
    const productInfo = productOverrides.overrides[slug];
    const productTitle =
      productInfo?.metaTitle ||
      slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const productDescription = productInfo?.metaDescription;
    const logo = productInfo?.logo;
    const fallbackImage = '/static/images/fallback.png';
    const tintColor = hashStringToColor(productTitle);

    // Get top 20 popular deals
    const topDeals = allCoreContent(
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
      .slice(0, 20);

    return (
      <div className="w-full flex flex-col items-center fancy-overlay">
        <Header />

        <div className="mt-24 text-center max-w-3xl px-6">
          <PageTitle>
            <span role="img" aria-label="eyes searching" className="mr-2">
              👀
            </span>
            Where did you put this deal?!
          </PageTitle>

          {logo && (
            <div className="flex justify-center mt-8 mb-6 group">
              <div className="flex gap-4 w-auto bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-xl py-3 px-6 items-center relative z-10 shadow-md group-hover:-translate-y-1 transition-all duration-300 ease-in-out">
                {logo ? (
                  <Image
                    aria-hidden="true"
                    className="absolute w-full h-full left-0 top-0 -z-100 opacity-20 dark:opacity-20 saturate-200 dark:saturate-[3] blur-2xl bg-cover"
                    src={logo}
                    alt={productTitle}
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
                    'w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white/50 dark:bg-black/50',
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
                <h2 className="text-xl md:text-2xl font-light">
                  {productTitle}
                </h2>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {productDescription && (
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl py-4 mx-auto">
                {productDescription}
              </p>
            )}

            <p className="text-xl text-gray-800 dark:text-gray-200">
              The deal for <span className="font-semibold">{productTitle}</span>{' '}
              is not available at the moment.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              This deal might have expired or simply hiding in the shadows... 👻
            </p>
          </div>
        </div>

        {topDeals.length > 0 && (
          <>
            <Separator className="my-12" />
            <section className="max-w-2xl 2xl:max-w-6xl w-full p-6 mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Might we interest you in these deals instead?
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Don't miss out on these amazing deals while you're here!
                </p>
              </div>

              <div className="flex flex-col w-full items-center justify-between">
                <div className="flex flex-col gap-4 w-full">
                  <ul className={'grid gap-4'}>
                    {topDeals.map((post) => (
                      <PostItem key={post.slug} post={post} showImage={true} />
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    );
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allBlogs.find((p) => p.path === path) as Blog;
  const authorList = post?.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Authors);
  });
  const mainContent = coreContent(post);

  // Generate appropriate JSON-LD based on layout type
  let jsonLd: Record<string, unknown>;

  if (post.layout === 'ProductLayout') {
    // Generate Product schema for ProductLayout
    const productUrl = siteConfig.siteUrl + '/' + post.path;
    const imageUrl = post.images?.[0]
      ? post.images[0].includes('http')
        ? post.images[0]
        : siteConfig.siteUrl + post.images[0]
      : siteConfig.siteUrl + siteConfig.socialBanner;

    // Type-safe access to product-specific fields
    const productPost = post as Blog & {
      metaDescription?: string;
      logo?: string;
      website?: string;
      deal?: string;
      expiresOnDate?: string;
    };

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: post.title.trim(),
      description: (
        productPost.metaDescription ||
        post.summary ||
        post.title
      ).trim(),
      image: imageUrl,
      url: productUrl,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        bestRating: '5',
        ratingCount: '1',
      },
      ...(post.categories &&
        post.categories.length > 0 && {
          category: post.categories.join(', '),
        }),
      ...(productPost.logo && {
        brand: {
          '@type': 'Brand',
          name: post.title.trim(),
          logo: productPost.logo.includes('http')
            ? productPost.logo.trim()
            : siteConfig.siteUrl + productPost.logo.trim(),
        },
      }),
      ...(productPost.website && {
        offers: {
          '@type': 'Offer',
          url: productPost.website.trim(),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          ...(productPost.deal && {
            description: productPost.deal.trim(),
          }),
          ...(productPost.expiresOnDate && {
            priceValidUntil: new Date(productPost.expiresOnDate).toISOString(),
          }),
        },
      }),
    };
  } else {
    // Use default Article schema for other layouts
    jsonLd = post.structuredData;
    jsonLd['author'] = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      };
    });
  }

  const Layout = layouts[post.layout || defaultLayout];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        <MDXLayoutRenderer
          code={post.body.code}
          components={components}
          toc={post.toc}
        />
      </Layout>
    </>
  );
}
