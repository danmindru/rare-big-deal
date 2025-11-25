import React, { useEffect, useRef, useState, useCallback } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { EmblaOptionsType } from 'embla-carousel';
import Link from 'next/link';
import { CoreContent } from '@shipixen/pliny/utils/contentlayer';
import { Blog } from 'shipixen-contentlayer/generated';
import Image from 'next/image';
import { Button } from '@/components/shared/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAutoplayProgress } from '@/components/showcase/EmblaCarouselAutoplayProgress';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import { hashStringToColor } from '@/components/shared/util/hash-string-color';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/ui/carousel';
import { usePathname } from 'next/navigation';

const fallbackImage = '/static/images/fallback.png';

type PropType = {
  apps: CoreContent<Blog>[];
  options?: EmblaOptionsType;
  autoplayOnHover?: boolean;
};

const EmblaCarousel: React.FC<PropType> = ({
  apps,
  options,
  autoplayOnHover = false,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const progressNode = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pathname = usePathname();
  const isCategoryPage =
    (pathname?.includes('/categories') ||
      pathname?.includes('/handpicked-deals')) ??
    false;

  const { showAutoplayProgress } = useAutoplayProgress(api, progressNode);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on('select', onSelect);
    onSelect();
  }, [api, onSelect]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const canScrollPrev = api?.canScrollPrev() ?? false;
  const canScrollNext = api?.canScrollNext() ?? false;

  // Calculate next app index with looping
  const nextIndex = (currentIndex + 1) % apps.length;
  const nextApp = apps[nextIndex];

  return (
    <div className="group relative flex flex-col w-full">
      <Carousel
        opts={{
          loop: true,
          ...options,
        }}
        plugins={[
          Autoplay({
            delay: 7000,
            stopOnInteraction: false,
            stopOnMouseEnter: autoplayOnHover,
          }),
        ]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {apps.map((app, index) => {
            const tintColor = hashStringToColor(app.title);

            return (
              <CarouselItem
                key={index}
                className={clsx(
                  'pl-0 flex items-center justify-center transition-opacity duration-500 ease-in-out',
                  index === currentIndex
                    ? 'opacity-100 grayscale-0'
                    : 'opacity-50 grayscale',
                )}
              >
                <Link
                  href={`/products/${app.slug}`}
                  className="flex flex-col w-full items-center"
                >
                  <Image
                    width={1600}
                    height={1600}
                    src={app.images?.[0]}
                    alt={app.title}
                    className={cn(
                      'w-full object-contain',
                      isCategoryPage
                        ? 'h-[220px] sm:h-[300px] md:h-[350px] lg:h-[450px]'
                        : 'h-[220px] md:h-[350px] 2xl:h-[650px]',
                    )}
                  />

                  <div className="flex flex-col items-center justify-center -mt-8">
                    <div className="flex gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-xl py-2 px-2 items-center">
                      {app.logo ? (
                        <Image
                          aria-hidden="true"
                          className="absolute w-full h-full left-0 top-0 -z-100 opacity-20 dark:opacity-20 saturate-200 dark:saturate-[3] blur-2xl bg-cover"
                          src={app.logo}
                          alt={app.title}
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div
                          className="absolute w-full h-full left-0 top-0 -z-100 opacity-20 dark:opacity-20 saturate-200 dark:saturate-[3] blur-2xl bg-cover"
                          style={{
                            backgroundImage: `url(${fallbackImage})`,
                            backgroundColor: tintColor,
                          }}
                        />
                      )}

                      <figure
                        className={clsx(
                          'w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-[20px] overflow-hidden bg-white/50 dark:bg-black/50',
                        )}
                      >
                        {app.logo ? (
                          <Image
                            src={app.logo}
                            alt={app.title}
                            width={200}
                            height={200}
                            className="dark:bg-white/20"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${fallbackImage})`,
                              backgroundColor: tintColor,
                            }}
                          />
                        )}
                      </figure>
                      <h2 className="text-xl md:text-xl lg:text-2xl font-light">
                        {app.title}
                      </h2>
                    </div>

                    <ReactMarkdown
                      className={cn(
                        'text-sm mt-4 transition-opacity delay-500 ease-in duration-700 text-green-500',
                        currentIndex === index ? 'opacity-100' : 'opacity-0',
                      )}
                      disallowedElements={['a']}
                    >
                      {app.deal}
                    </ReactMarkdown>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation buttons */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Additional markup such as progress indicators */}
      <div className="absolute w-full -top-24 flex gap-2 items-center justify-end p-2">
        <div className="flex gap-1 items-end flex-col">
          <Button
            variant="ghost"
            onClick={scrollNext}
            className={clsx(
              `embla__progress relative overflow-hidden flex items-center gap-2 pt-3 pb-4 px-3 h-10 md:h-14 md:min-w-32 bg-white dark:bg-black`,
            )}
          >
            <div className="border-gradient-rainbow absolute w-full bottom-0"></div>

            {nextApp.logo ? (
              <Image
                width={200}
                height={200}
                src={nextApp.logo as string}
                alt={nextApp.title}
                className="w-6 h-6 md:w-10 md:h-10 rounded-xl"
              />
            ) : (
              <div
                className="w-6 h-6 md:w-10 md:h-10 rounded-xl"
                style={{
                  backgroundImage: `url(${fallbackImage})`,
                  backgroundColor: hashStringToColor(nextApp.title),
                }}
              />
            )}
            <span className="hidden md:flex">{nextApp.title}</span>

            <div
              className={clsx(
                'embla__progress__bar absolute top-0 left-0 w-full h-full backdrop-grayscale z-10',
                !showAutoplayProgress ? 'opacity-0' : 'opacity-100',
              )}
              ref={progressNode}
              style={{ transform: 'translate3d(100%, 0, 0)' }}
            />
          </Button>

          <p className="text-xs font-semibold uppercase opacity-50 mr-1 p-0.5">
            Up next
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
