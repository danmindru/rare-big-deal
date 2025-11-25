import { cn } from '@/lib/utils';
import { siteConfig } from '@/data/config/site.settings';
import { headerNavLinks } from '@/data/config/headerNavLinks';
import Link from './Link';
import MobileNav from './MobileNav';
import ThemeSwitch from './ThemeSwitch';
import SearchButton from '../search/SearchButton';
import ActiveLink from '@/components/shared/ActiveLink';
import Image from '@/components/shared/Image';
import { GithubIcon } from 'lucide-react';

const Header = ({
  containerClassName,
  className,
}: {
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'bg-gray-200/60 dark:bg-gray-900 w-full flex items-center justify-center',
        containerClassName,
      )}
    >
      <header
        className={cn(
          'flex items-center gap-4 sm:gap-6 md:gap-10 py-10 flex-wrap w-full pt-6 p-6 max-w-full container-wide',
          className,
        )}
      >
        <div>
          <Link href="/" aria-label={siteConfig.logoTitle}>
            <div className="flex items-center gap-3 justify-between">
              <Image
                src="/static/images/logo.png"
                alt="Rare Big Deal logo"
                height={54}
                width={54}
                className="group-hover:animate-wiggle w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/50 dark:border-neutral-900"
              />

              <div className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-4 md:leading-4 font-semibold h-full">
                <span className="font-light">Rare</span>
                <br />
                <span className="font-normal">Big</span>
                <br />
                <span className="font-semibold">Deal</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-grow items-center justify-center leading-5 gap-4 sm:gap-6">
          {headerNavLinks.map((link) => (
            <ActiveLink
              key={link.title}
              href={link.href}
              className="nav-link hidden sm:block"
              activeClassName="nav-link-active"
            >
              <span>{link.title}</span>
            </ActiveLink>
          ))}
        </div>

        <div className="ml-auto flex items-center leading-5 gap-4 sm:gap-6 text-sm">
          {/* <a
          href="https://www.youtube.com/live/F7cs6tB_iX0?si=NSdAvCJyicar61zj&t=2924"
          target="_blank"
          rel="noopener noreferrer"
          className="animated-fancy-text hidden lg:inline-block"
        >
          Made with Shipixen{' '}
          <span className="hidden xl:inline-block">in hours</span>
        </a> */}

          <a
            className="hidden sm:flex"
            href="https://github.com/danmindru/rare-big-deal"
          >
            <GithubIcon size={24} className="w-4 h-4 md:w-6 md:h-6" />
          </a>

          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </header>
    </div>
  );
};

export default Header;
