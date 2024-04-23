"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { cn } from "~/lib/utils";

import type { EmblaOptionsType } from "embla-carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type CarouselContextType = {
  currentIndex: number;
  canScrollNext: boolean;
  canScrollPrevious: boolean;
  scrollNext: () => void;
  scrollPrev: () => void;
  goTo: (index: number) => void;
  carouselRef: UseEmblaCarouselType[0];
};

const CarouselContext = createContext<CarouselContextType | null>(null);

function useCarouselContext() {
  const context = useContext(CarouselContext);
  if (context === null)
    throw new Error("Must be used inside of a <Carousel /> component");
  return context;
}

/*
    <Carousel.Root>
      <Carousel.Viewport>
        <Carousel.Items>
          <CarouselItem>...</CarouselItem>
          <CarouselItem>...</CarouselItem>
          <CarouselItem>...</CarouselItem>
        </Carousel.Items>
      </Carousel.Viewport>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel.Root>
*/

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: EmblaOptionsType;
  attachHandlers?: boolean;
}

const CarouselRoot = forwardRef<HTMLDivElement, CarouselProps>(
  function CarouselRoot(props, ref) {
    const { options = {}, attachHandlers = false, className, ...rest } = props;
    const [carouselRef, carouselApi] = useEmblaCarousel(options, [
      WheelGesturesPlugin(),
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [canScrollPrevious, setCanScrollPrevious] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const scrollPrev = useCallback(() => {
      if (carouselApi) carouselApi.scrollPrev();
    }, [carouselApi]);

    const scrollNext = useCallback(() => {
      if (carouselApi) carouselApi.scrollNext();
    }, [carouselApi]);

    const goTo = useCallback(
      (index: number) => {
        if (carouselApi) carouselApi.scrollTo(index);
      },
      [carouselApi]
    );

    useEffect(() => {
      if (!carouselApi) return;

      function onSelect() {
        if (!carouselApi) return;

        setCanScrollPrevious(carouselApi.canScrollPrev());
        setCanScrollNext(carouselApi.canScrollNext());
      }

      function onScroll() {
        if (!carouselApi) return;

        setCurrentIndex(carouselApi.selectedScrollSnap());
      }

      onSelect();
      carouselApi.on("select", onSelect);
      carouselApi.on("reInit", onSelect);
      carouselApi.on("scroll", onScroll);
    }, [carouselApi]);

    useEffect(() => {
      if (!carouselApi || !attachHandlers) return;

      function handleKeyPress(e: KeyboardEvent) {
        if (!carouselApi) return;

        if (e.key === "ArrowLeft") {
          carouselApi.scrollPrev();
        }

        if (e.key === "ArrowRight") {
          carouselApi.scrollNext();
        }
      }

      document.addEventListener("keydown", handleKeyPress, false);

      return () => {
        document.removeEventListener("keydown", handleKeyPress, false);
      };
    }, [carouselApi, attachHandlers]);

    // blocks excessive scrolling
    // https://github.com/davidjerleke/embla-carousel/issues/42#issuecomment-1670221979
    useEffect(() => {
      if (!carouselApi) return;

      carouselApi.on("scroll", (carouselApi) => {
        const {
          limit,
          target,
          location,
          offsetLocation,
          scrollTo,
          translate,
          scrollBody,
        } = carouselApi.internalEngine();

        let edge: number | null = null;

        if (limit.reachedMax(location.get())) edge = limit.max;
        if (limit.reachedMin(location.get())) edge = limit.min;

        if (edge !== null) {
          offsetLocation.set(edge);
          location.set(edge);
          target.set(edge);
          translate.to(edge);
          translate.toggleActive(false);
          scrollBody.useDuration(0).useFriction(0);
          scrollTo.distance(0, false);
        } else {
          translate.toggleActive(true);
        }
      });
    }, [carouselApi]);

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          canScrollNext,
          canScrollPrevious,
          scrollNext,
          scrollPrev,
          goTo,
          carouselRef,
        }}
      >
        <div
          ref={ref}
          className={cn("group relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...rest}
        />
      </CarouselContext.Provider>
    );
  }
);

const CarouselBack = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function CarouselBack({ className, ...rest }, ref) {
  const { canScrollPrevious, scrollPrev } = useCarouselContext();

  return (
    <button
      ref={ref}
      className={cn({ "opacity-30": !canScrollPrevious }, className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        scrollPrev();
      }}
      disabled={canScrollPrevious === false}
      {...rest}
    />
  );
});

const CarouselForward = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function CarouselForward({ className, ...rest }, ref) {
  const { canScrollNext, scrollNext } = useCarouselContext();

  return (
    <button
      ref={ref}
      className={cn({ "opacity-30": !canScrollNext }, className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        scrollNext();
      }}
      disabled={canScrollNext === false}
      {...rest}
    />
  );
});

const CarouselViewport = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CarouselViewport(props, ref) {
  const { className, ...rest } = props;
  const { carouselRef } = useCarouselContext();

  return (
    <div
      ref={carouselRef}
      className={cn("overflow-hidden", className)}
      {...rest}
    />
  );
});

const CarouselItems = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CarouselItems(props, ref) {
  const { className, ...rest } = props;
  const { currentIndex } = useCarouselContext();

  return (
    <div
      ref={ref}
      className={cn("flex gap-4 lg:gap-6", className)}
      data-current-index={currentIndex}
      {...rest}
    />
  );
});

const CarouselItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CarouselItem(props, ref) {
  const { className, ...rest } = props;

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...rest}
    />
  );
});

const CarouselGoTo = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    index: number;
  }
>(function CarouselGoTo(props, ref) {
  const { index, onClick, ...rest } = props;
  const { goTo } = useCarouselContext();

  return (
    <button
      ref={ref}
      onClick={(event) => {
        goTo(index);

        if (onClick) onClick(event);
      }}
      {...rest}
    />
  );
});

const CarouselDot = forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    index: number;
  }
>(function CarouselDot(props, ref) {
  const { index, ...rest } = props;
  const { currentIndex } = useCarouselContext();
  const isActive = currentIndex === index;

  return <Slot ref={ref} data-is-active={isActive} {...rest} />;
});

const Root = CarouselRoot;
const Back = CarouselBack;
const Forward = CarouselForward;
const Viewport = CarouselViewport;
const Items = CarouselItems;
const Item = CarouselItem;
const GoTo = CarouselGoTo;
const Dot = CarouselDot;

export {
  Root,
  Back,
  Forward,
  Viewport,
  Items,
  Item,
  GoTo,
  Dot,
  useCarouselContext,
};
