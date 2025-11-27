import { allCoreContent, sortPosts } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import { genPageMetadata } from 'app/seo';
import Header from '@/components/shared/Header';
import Image from '@/components/shared/Image';
import Link from '@/components/shared/Link';

export const metadata = genPageMetadata({
  title: 'All Apps',
  description: 'Browse all apps with amazing deals',
});

export default function AllAppsPage() {
  const posts = allCoreContent(sortPosts(allBlogs));

  // Get unique posts by slug and filter only those with logos
  const uniquePostsWithLogos = posts.reduce(
    (acc, post) => {
      if (post.logo && !acc.some((p) => p.slug === post.slug)) {
        acc.push(post);
      }
      return acc;
    },
    [] as typeof posts,
  );

  return (
    <div className="flex flex-col w-full items-center justify-between bg-gray-200/60 dark:bg-gray-900">
      <Header />
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            All Apps
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {uniquePostsWithLogos.length} amazing apps across all categories
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:gap-3 xl:gap-4">
          {uniquePostsWithLogos
            .filter((post) => {
              if (
                [
                  'FaceCam',
                  'Django daisyUI Starter Kit',
                  'Know Your Numbers',
                  'Redac',
                  'ResizeGenius',
                  'Side Projects Making $$$+',
                  'MGC Animation',
                  'MGC ICON',
                  'MGC Weather',
                  'Triggla',
                ].includes(post.title.trim())
              ) {
                return false;
              }

              if (
                post.categories?.[0] &&
                ['Learning'].includes(post.categories[0])
              ) {
                return false;
              }

              return true;
            })
            .map((post) => (
              <Link
                key={post.slug}
                href={`/products/${post.slug}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={post.logo!}
                    alt={post.title}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors truncate opacity-0 group-hover:opacity-100 absolute top-32 left-0 px-4 sm:px-6 lg:px-8">
                  {post.title}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
