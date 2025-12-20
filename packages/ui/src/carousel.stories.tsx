import type { Meta, StoryObj } from "@storybook/react";
import * as Carousel from "./carousel";

const meta = {
  title: "UI/Carousel",
  component: Carousel.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel.Root className="w-full max-w-sm">
      <Carousel.Viewport>
        <Carousel.Items>
          {[1, 2, 3].map((i) => (
            <Carousel.Item key={i}>
              <div className="flex h-40 items-center justify-center rounded-lg bg-slate-700 text-white">
                Slide {i}
              </div>
            </Carousel.Item>
          ))}
        </Carousel.Items>
      </Carousel.Viewport>
      <div className="mt-4 flex justify-center gap-2">
        <Carousel.Back className="rounded bg-slate-600 px-3 py-1 text-white">
          Prev
        </Carousel.Back>
        <Carousel.Forward className="rounded bg-slate-600 px-3 py-1 text-white">
          Next
        </Carousel.Forward>
      </div>
    </Carousel.Root>
  ),
};
