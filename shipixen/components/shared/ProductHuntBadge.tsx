'use client';

export const ProductHuntBadge = ({
  postName,
  postId,
  theme = 'light',
  topic = 'featured',
}: {
  postName: string;
  postId: string;
  theme?: 'light' | 'dark' | 'neutral';
  topic?: 'top-post-badge' | 'topic-dev-tools' | 'featured';
}) => {
  const baseimageSrc = `https://api.producthunt.com/widgets/embed-image/v1`;

  let imageSrc = '' + baseimageSrc;

  switch (topic) {
    case 'top-post-badge':
      imageSrc += `/top-post-badge.svg?post_id=${postId}&period=daily`;
      break;
    case 'topic-dev-tools':
      imageSrc += `/top-post-topic-badge.svg?post_id=424261&period=weekly&topic_id=267`;
      break;
    case 'featured':
      imageSrc += `/featured.svg?post_id=${postId}`;
      break;
    default:
      imageSrc += `/top-post-badge.svg?post_id=${postId}&period=daily`;
  }

  imageSrc += `&theme=${theme}`;

  return (
    <a
      href={`https://www.producthunt.com/posts/${postName.toLowerCase()}?utm_source=${postName.toLowerCase()}`}
      target={`_blank`}
      rel={`noopener noreferrer`}
    >
      <img
        src={imageSrc}
        alt={`${postName} | Product Hunt`}
        className="w-52 h-auto"
        width="250"
        height="54"
      />
    </a>
  );
};
