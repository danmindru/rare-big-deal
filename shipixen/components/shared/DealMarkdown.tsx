import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm-react';
import { dealCardText } from '@/lib/deal-card-text';
import { prepareDealMarkdown } from '@/lib/deal-markdown';

/**
 * react-markdown 9 (unified 11) needs remark-gfm 4.
 * Product MDX stays on remark-gfm 3, which contentlayer's unified 10 can load.
 */
const dealMarkdownComponents: Components = {
  del({ children }) {
    return (
      <del className="mx-0.5 font-normal text-gray-500 line-through decoration-gray-400 dark:text-gray-400 dark:decoration-gray-500">
        {children}
      </del>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold">{children}</strong>;
  },
  code({ children }) {
    return (
      <code className="font-mono text-[0.95em] [overflow-wrap:anywhere]">
        {children}
      </code>
    );
  },
};

export function DealMarkdown({
  children,
  className,
  components,
}: {
  children?: string | null;
  className?: string;
  components?: Components;
}) {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      disallowedElements={['a']}
      unwrapDisallowed
      components={{ ...dealMarkdownComponents, ...components }}
    >
      {prepareDealMarkdown(dealCardText(children))}
    </ReactMarkdown>
  );
}
