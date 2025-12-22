import type { Meta, StoryObj } from "@storybook/react";

import { Alert } from "./alert";

const meta = {
  title: "Crafts/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["note", "warning", "caution", "important", "tip"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {
  args: {
    variant: "note",
    children: (
      <p>
        Useful information that users should know, even when skimming content.
      </p>
    ),
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: (
      <p>Urgent info that needs immediate user attention to avoid problems.</p>
    ),
  },
};

export const Caution: Story = {
  args: {
    variant: "caution",
    children: (
      <p>Advises about risks or negative outcomes of certain actions.</p>
    ),
  },
};

export const Important: Story = {
  args: {
    variant: "important",
    children: <p>Key information users need to know to achieve their goal.</p>,
  },
};

export const Tip: Story = {
  args: {
    variant: "tip",
    children: <p>Helpful advice for doing things better or more easily.</p>,
  },
};
