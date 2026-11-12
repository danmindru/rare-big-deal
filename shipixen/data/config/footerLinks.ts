export const footerLinks: Array<{
  columnName: string;
  links: Array<{
    href: string;
    title: string;
  }>;
}> = [
  {
    columnName: 'Popular Categories',
    links: [
      {
        href: '/categories/ai-tools',
        title: 'AI Tools',
      },
      {
        href: '/categories/macos-apps',
        title: 'MacOS Apps',
      },
      {
        href: '/categories/developer-tools',
        title: 'Developer Tools',
      },
    ],
  },

  {
    columnName: 'Categories',
    links: [
      {
        href: '/categories/ai-tools',
        title: 'AI Tools',
      },
      {
        href: '/categories/developer-tools',
        title: 'Developer Tools',
      },
      {
        href: '/categories/ios-apps',
        title: 'iOS Apps',
      },
      {
        href: '/categories/macos-apps',
        title: 'MacOS Apps',
      },
      {
        href: '/categories/productivity',
        title: 'Productivity',
      },
      {
        href: '/categories/marketing',
        title: 'Marketing',
      },
      {
        href: '/categories/learning',
        title: 'Learning',
      },
      {
        href: '/categories/miscellaneous',
        title: 'Miscellaneous',
      },
    ],
  },

  {
    columnName: 'Company',
    links: [
      { href: '/', title: 'Home' },
      { href: '/categories/developer-tools', title: 'All Categories' },
      { href: '/handpicked-deals', title: 'Staff Picks' },
      { href: '/most-popular', title: 'Most Popular' },
      { href: '/all-deals', title: 'All Deals' },
      { href: '/all-apps', title: 'All Apps' },
      {
        href: 'https://github.com/danmindru/rare-big-deal/issues/130',
        title: 'Submit',
      },
    ],
  },
  {
    columnName: 'Support',
    links: [
      {
        href: 'https://github.com/danmindru/rare-big-deal/issues/132',
        title: 'Creating a Bundle',
      },
      {
        href: 'https://github.com/danmindru/rare-big-deal/issues/131',
        title: 'Adding custom metadata',
      },
      { href: '/terms', title: 'Terms of Service' },
      { href: '/privacy', title: 'Privacy Policy' },
    ],
  },
];
