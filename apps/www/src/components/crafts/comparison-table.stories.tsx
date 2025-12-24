import type { Meta, StoryObj } from "@storybook/react";

import { ComparisonTable } from "./comparison-table";

const meta = {
  title: "Crafts/ComparisonTable",
  component: ComparisonTable,
  tags: ["autodocs"],
} satisfies Meta<typeof ComparisonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headers: ["Feature", "Free", "Pro"],
    rows: [
      ["Storage", "5GB", "100GB"],
      ["Users", "1", "Unlimited"],
      ["Support", "Email", "24/7 Phone"],
    ],
  },
};
