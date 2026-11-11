/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { withOutboundRef } from '@/lib/outbound-ref';

export const CustomLink = ({
  href,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return <Link prefetch={false} href={href} {...rest} />;
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />;
  }

  const outboundHref = typeof href === 'string' ? withOutboundRef(href) : href;

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={outboundHref}
      {...rest}
    />
  );
};

export default CustomLink;
