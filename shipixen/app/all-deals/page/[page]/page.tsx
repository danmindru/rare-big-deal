import { Metadata } from 'next';
import { allCoreContent, sortPosts } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import { POSTS_PER_PAGE } from '@/app/all-deals/settings';
import ListLayout from '@/layouts/ListLayoutWithTags';
import Header from '@/components/shared/Header';
import { genPageMetadata } from 'app/seo';
import { siteConfig } from '@/data/config/site.settings';

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));

  return paths;
};

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const pageNumber = parseInt(params.page as string);
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE);

  return genPageMetadata({
    title: `All Deals - Page ${pageNumber}${pageNumber > 1 ? ` of ${totalPages}` : ''}`,
    description: `Browse all deals, discounts, and lifetime offers on iOS, Mac, SaaS, AI and Web apps. Page ${pageNumber} of ${totalPages}. Discover amazing apps, AI tools, SaaS products, and more with exclusive deals.`,
  });
}

export default function Page({ params }: { params: { page: string } }) {
  const posts = allCoreContent(sortPosts(allBlogs));
  const pageNumber = parseInt(params.page as string);
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <div className="flex flex-col w-full items-center justify-between">
      <Header />

      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Deals"
      />
    </div>
  );
}
