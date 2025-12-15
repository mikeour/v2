"use client";

import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import type { EmblaOptionsType } from "embla-carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { cn, mergeRefs } from "./utils";

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
  if (context === null) {
    throw new Error("Must be used inside of a <Carousel /> component");
  }
  return context;
}

interface CarouselRootProps extends HTMLAttributes<HTMLDivElement> {
  options?: EmblaOptionsType;
  attachHandlers?: boolean;
}

function CarouselRoot({
  options = {},
  attachHandlers = false,
  className,
  ...rest
}: CarouselRootProps) {
  const [carouselRef, carouselApi] = useEmblaCarousel(options, [
    WheelGesturesPlugin(),
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (carouselApi) {
      carouselApi.scrollPrev();
    }
  }, [carouselApi]);

  const scrollNext = useCallback(() => {
    if (carouselApi) {
      carouselApi.scrollNext();
    }
  }, [carouselApi]);

  const goTo = useCallback(
    (index: number) => {
      if (carouselApi) {
        carouselApi.scrollTo(index);
      }
    },
    [carouselApi]
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    function onSelect() {
      if (!carouselApi) {
        return;
      }

      setCanScrollPrevious(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    }

    function onScroll() {
      if (!carouselApi) {
        return;
      }

      setCurrentIndex(carouselApi.selectedScrollSnap());
    }

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);
    carouselApi.on("scroll", onScroll);
  }, [carouselApi]);

  useEffect(() => {
    if (!(carouselApi && attachHandlers)) {
      return;
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (!carouselApi) {
        return;
      }

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

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on("scroll", (api) => {
      const {
        limit,
        target,
        location,
        offsetLocation,
        scrollTo,
        translate,
        scrollBody,
      } = api.internalEngine();

      let edge: number | null = null;

      if (limit.reachedMax(location.get())) {
        edge = limit.max;
      }
      if (limit.reachedMin(location.get())) {
        edge = limit.min;
      }

      if (edge !== null) {
        offsetLocation.set(edge);
        location.set(edge);
        target.set(edge);
        translate.to(edge);
        translate.toggleActive(false);
        // biome-ignore lint/correctness/useHookAtTopLevel: Embla API methods, not React hooks
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
      <section className={cn("group relative", className)} {...rest} />
    </CarouselContext.Provider>
  );
}

function CarouselBack({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { canScrollPrevious, scrollPrev } = useCarouselContext();

  return (
    <button
      className={cn({ "opacity-30": !canScrollPrevious }, className)}
      disabled={canScrollPrevious === false}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        scrollPrev();
      }}
      type="button"
      {...rest}
    />
  );
}

function CarouselForward({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { canScrollNext, scrollNext } = useCarouselContext();

  return (
    <button
      className={cn({ "opacity-30": !canScrollNext }, className)}
      disabled={canScrollNext === false}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        scrollNext();
      }}
      type="button"
      {...rest}
    />
  );
}

function CarouselViewport({ className, ref, ...rest }: ComponentProps<"div">) {
  const { carouselRef } = useCarouselContext();

  return (
    <div
      className={cn("overflow-hidden", className)}
      ref={mergeRefs([carouselRef, ref])}
      {...rest}
    />
  );
}

function CarouselItems({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { currentIndex } = useCarouselContext();

  return (
    <div
      className={cn("flex gap-4 lg:gap-6", className)}
      data-current-index={currentIndex}
      {...rest}
    />
  );
}

function CarouselItem({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: carousel item needs div for styling
    <div
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      role="group"
      {...rest}
    />
  );
}

function CarouselGoTo({
  index,
  onClick,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { index: number }) {
  const { goTo } = useCarouselContext();

  return (
    <button
      onClick={(event) => {
        goTo(index);
        onClick?.(event);
      }}
      type="button"
      {...rest}
    />
  );
}

function CarouselDot({
  index,
  ...rest
}: ComponentProps<typeof Slot> & { index: number }) {
  const { currentIndex } = useCarouselContext();
  const isActive = currentIndex === index;

  return <Slot data-is-active={isActive} {...rest} />;
}

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
