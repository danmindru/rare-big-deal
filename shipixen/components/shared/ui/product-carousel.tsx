import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/ui/carousel';
import Image from '@/components/shared/Image';

interface ProductCarouselProps {
  images: string[];
  title?: string;
  className?: string;
}

export function ProductCarousel({
  images,
  title = 'Product',
  className,
}: ProductCarouselProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full relative mb-2 -mt-5 md:-mt-8 max-h-[380px] sm:max-h-[450px] select-none',
        className,
      )}
    >
      <Carousel
        opts={{
          align: 'center',
          loop: true,
          slidesToScroll: 1,
          containScroll: 'trimSnaps',
        }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 h-full">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-[95%] sm:basis-auto h-full"
            >
              <div className="relative h-full flex items-center justify-center">
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  width={1240}
                  height={640}
                  className="bg-white rounded-md w-full sm:w-auto max-h-[380px] sm:max-h-[450px] object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
