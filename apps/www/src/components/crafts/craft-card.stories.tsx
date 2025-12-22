import type { Meta, StoryObj } from "@storybook/react";

import { CraftCard, CraftCardFeatured } from "./craft-card";

// Placeholder image for stories
const placeholderImage = {
  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2352525b' width='400' height='300'/%3E%3C/svg%3E",
  width: 400,
  height: 300,
};

const meta: Meta<typeof CraftCard> = {
  title: "Crafts/CraftCard",
  component: CraftCard,
};

export default meta;

export const Default: StoryObj<typeof CraftCard> = {
  args: {
    title: "Scroll Shadows",
    image: placeholderImage,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};

export const Featured: StoryObj<typeof CraftCardFeatured> = {
  render: (args) => <CraftCardFeatured {...args} />,
  args: {
    title: "Scroll Shadows",
    date: "April 22, 2024",
    image: placeholderImage,
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};
