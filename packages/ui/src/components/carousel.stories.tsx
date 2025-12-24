import type { Meta, StoryObj } from "@storybook/react";

import { Back, Forward, Item, Items, Root, Viewport } from "./carousel";

const meta = {
  title: "UI/Carousel",
  component: Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Root className="w-full max-w-sm">
      <Viewport>
        <Items>
          {[1, 2, 3].map((i) => (
            <Item key={i}>
              <div className="flex h-40 items-center justify-center rounded-lg bg-slate-700 text-white">
                Slide {i}
              </div>
            </Item>
          ))}
        </Items>
      </Viewport>
      <div className="mt-4 flex justify-center gap-2">
        <Back className="rounded bg-slate-600 px-3 py-1 text-white">Prev</Back>
        <Forward className="rounded bg-slate-600 px-3 py-1 text-white">
          Next
        </Forward>
      </div>
    </Root>
  ),
};
