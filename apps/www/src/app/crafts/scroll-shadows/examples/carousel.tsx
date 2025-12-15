"use client";

import { cn } from "@mikeour/ui/utils";
import Image from "next/image";

import { ExampleContainer } from "~/components/crafts/example-container";
import { BrokenScrollContainer, ScrollContainer } from "./scroll-container";

export function CarouselExample({ count }: { count?: number }) {
  return (
    <ExampleContainer className="w-full" isolated mockBrowser>
      <ScrollContainer
        axis="x"
        className="max-h-100 w-full bg-white [--size:25px]"
      >
        <Carousel count={count} />
      </ScrollContainer>
    </ExampleContainer>
  );
}

export function BrokenCarouselExample({ count }: { count: number }) {
  return (
    <ExampleContainer className="w-full" mockBrowser>
      <BrokenScrollContainer
        axis="x"
        className="max-h-100 w-full bg-white [--size:25px]"
      >
        <Carousel count={count} />
      </BrokenScrollContainer>
    </ExampleContainer>
  );
}

export function Carousel({
  count = 10,
  className,
}: React.PropsWithChildren<{ count?: number; className?: string }>) {
  return (
    <div className={cn("flex gap-6 p-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="aspect-square size-44 rounded-xl bg-zinc-200"
          // biome-ignore lint/suspicious/noArrayIndexKey: static content
          key={index}
        />
      ))}
    </div>
  );
}

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1641353989082-9b15fa661805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400",
  },

  {
    id: 2,
    src: "https://images.unsplash.com/photo-1642190672487-22bde32965f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400",
  },

  {
    id: 3,
    src: "https://images.unsplash.com/photo-1641841344411-49dbd02896f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400",
  },

  {
    id: 4,
    src: "https://images.unsplash.com/photo-1643223723262-7ce785730cf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400",
  },

  {
    id: 5,
    src: "https://images.unsplash.com/photo-1640938776314-4d303f8a1380?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODc2Mw&ixlib=rb-1.2.1&q=80&w=400",
  },
];

const carousels = [
  { id: 1, label: "Action", images },
  { id: 2, label: "Adventure", images },
  { id: 3, label: "Adventure", images },
  { id: 4, label: "Adventure", images },
  { id: 5, label: "Adventure", images },
  { id: 6, label: "Adventure", images },
  { id: 7, label: "Adventure", images },
];

export function NetflixCarousel() {
  return (
    <ExampleContainer className="w-full bg-gray-900" mockBrowser>
      <ScrollContainer axis="y" className="no-scrollbar max-h-137.5 w-full">
        <div className="flex flex-col gap-8 py-10">
          {carousels.map((carousel) => (
            <div className="flex flex-col gap-4" key={carousel.id}>
              <h3 className="px-6 font-semibold text-white text-xl/none">
                {carousel.label}
              </h3>

              <ScrollContainer axis="x" className="no-scrollbar w-full">
                <div className="flex gap-6 px-6">
                  {carousel.images.map((image) => (
                    <div
                      className="relative aspect-video w-74 overflow-hidden rounded bg-zinc-200"
                      key={image.id}
                    >
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        src={image.src}
                      />
                    </div>
                  ))}
                </div>
              </ScrollContainer>
            </div>
          ))}
        </div>
      </ScrollContainer>
    </ExampleContainer>
  );
}
