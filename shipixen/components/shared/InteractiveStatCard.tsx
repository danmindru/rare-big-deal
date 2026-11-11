import clsx from 'clsx';
import Link from 'next/link';
import { withOutboundRef } from '@/lib/outbound-ref';

const Wrapper = ({
  children,
  href,
  bgBlurStrength,
}: {
  children: React.ReactNode;
  href?: string;
  bgBlurStrength?: 'none' | 'low' | 'medium' | 'high';
}) => {
  if (!href) {
    return <>{children}</>;
  }

  return (
    <Link
      className="w-full h-full flex flex-col items-stretch"
      href={withOutboundRef(href)}
    >
      <div
        className={clsx(
          'w-full h-full !absolute top-0 left-0 fancy-glass',
          bgBlurStrength === 'low' ? 'opacity-30' : null,
          bgBlurStrength === 'medium' ? 'opacity-50' : null,
          bgBlurStrength === 'high' ? 'opacity-70' : null,
          bgBlurStrength === 'none' ? 'opacity-0' : null,
        )}
        aria-hidden="true"
      ></div>

      <div className="z-10 w-full h-full flex items-center justify-center rounded-lg">
        {children}
      </div>
    </Link>
  );
};

export const InteractiveStatCard = ({
  className,
  bgBlurStrength = 'high',
  shadowStrength = 'low',
  children,
  hoverComponent,
  stretchHoverComponent = false,
  disabled,
  href,
}: {
  className?: string;
  bgBlurStrength?: 'none' | 'low' | 'medium' | 'high';
  shadowStrength?: 'none' | 'low' | 'medium' | 'high';
  children: React.ReactNode;
  hoverComponent: React.ReactNode;
  stretchHoverComponent?: boolean;
  disabled?: boolean;
  href?: string;
}) => {
  return (
    <div
      className={clsx(
        className,
        'w-full rounded-lg flex flex-col items-center justify-center bg-slate-100/90 dark:bg-black/50 border border-solid border-slate-200 dark:border-slate-800 group relative transition-shadow duration-500 hover:shadow-xl min-h-[5rem] overflow-hidden',
        shadowStrength === 'low' ? 'shadow-md' : null,
        shadowStrength === 'medium' ? 'shadow-lg' : null,
        shadowStrength === 'high' ? 'shadow-xl' : null,
        shadowStrength === 'none' ? 'shadow-none' : null,
      )}
    >
      <Wrapper href={href} bgBlurStrength={bgBlurStrength}>
        {children}

        {!disabled ? (
          <div
            className={clsx(
              'rounded-lg opacity-0 -translate-y-full group-hover:translate-y-0 group-hover:opacity-100 flex flex-col justify-center px-2 py-1 absolute z-50 transition-all ease-linear bg-white/90 dark:bg-slate-800/90 dark:text-white text-black backdrop-blur-md',
              stretchHoverComponent ? 'w-full h-full items-center' : 'w-auto',
            )}
          >
            {hoverComponent}
          </div>
        ) : null}
      </Wrapper>
    </div>
  );
};
