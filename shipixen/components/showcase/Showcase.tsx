'use client';
import EmblaCarousel from './EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { allBlogs, Blog } from 'shipixen-contentlayer/generated';
import { slug } from 'github-slugger';

import './css/embla.css';
import { CoreContent } from '@shipixen/pliny/utils/contentlayer';
import { cn } from '@/lib/utils';
import { PostItem } from '@/components/blog/home/PostItem';

const OPTIONS: EmblaOptionsType = { loop: true };

export const Showcase = ({
  className,
  bundle,
  autoplayOnHover = false,
  showAppList = false,
  allAppsDescription = 'All handpicked apps in this category',
}: {
  className?: string;
  bundle: {
    name: string;
    description: string;
    apps: string[];
  };
  autoplayOnHover?: boolean;
  showAppList?: boolean;
  allAppsDescription?: string;
}) => {
  const apps = bundle.apps
    .map((appName) =>
      allBlogs.find((post) => {
        return slug(post.title) === slug(appName);
      }),
    )
    .filter(Boolean) as CoreContent<Blog>[];

  if (apps.length === 0) {
    return <></>;
  }

  return (
    <div
      className={cn(
        'flex flex-col max-w-4xl 2xl:max-w-7xl w-full bg-gray-200/60 dark:bg-gray-900 rounded-xl py-6',
        className,
      )}
    >
      <div className="flex flex-col gap-1 px-6">
        <h2 className="text-lg md:text-2xl font-bold">{bundle.name}</h2>
        <p className="text-xs md:text-sm mb-8 mr-16">{bundle.description}</p>
      </div>

      <EmblaCarousel
        apps={apps}
        options={OPTIONS}
        autoplayOnHover={autoplayOnHover}
      />

      {showAppList ? (
       <div className='flex flex-col'>
          <hr className="border-gray-500/50 my-10 w-8 p-0 self-center" />
          <p className="text-center px-4 mb-6 text-sm text-gray-500/90">{allAppsDescription}</p>

         <ul className="grid grid-cols-1 gap-4 px-6">
          {apps.map((post) => (
            <PostItem key={post.slug} post={post} showImage={true} />
          ))}
        </ul>
       </div>
      ) : (
       <></>
      )}
    </div>
  );
};
