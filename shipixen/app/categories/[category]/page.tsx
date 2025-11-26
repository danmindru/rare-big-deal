import { Metadata } from 'next';
import { slug } from 'github-slugger';
import { allCoreContent } from '@shipixen/pliny/utils/contentlayer';
import { allBlogs } from 'shipixen-contentlayer/generated';
import { genPageMetadata } from 'app/seo';
import CategoryClient from './CategoryClient';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const categoryName = params.category
    ?.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const posts = allCoreContent(
    allBlogs.filter(
      (post) =>
        post.categories &&
        post.categories.some((cat) => slug(cat) === params.category),
    ),
  );

  return genPageMetadata({
    title: `${categoryName} Deals`,
    description: `Discover the best deals on iOS, Mac, SaaS, AI and Web apps for ${categoryName}. ${posts.length} amazing deals available now!`,
  });
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <CategoryClient category={params.category} />;
}
