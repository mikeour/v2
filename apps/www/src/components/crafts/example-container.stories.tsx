import type { Meta, StoryObj } from "@storybook/react";
import { ExampleContainer } from "./example-container";

const meta = {
  title: "Crafts/ExampleContainer",
  component: ExampleContainer,
  tags: ["autodocs"],
} satisfies Meta<typeof ExampleContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    isolated: true,
    children: (
      <div className="h-32 w-64 rounded bg-blue-500 flex items-center justify-center text-white">
        Demo Content
      </div>
    ),
  },
};

export const WithCaption: Story = {
  args: {
    isolated: true,
    caption: "This is a caption describing the example.",
    children: (
      <div className="h-32 w-64 rounded bg-blue-500 flex items-center justify-center text-white">
        Demo Content
      </div>
    ),
  },
};

export const WithControls: Story = {
  args: {
    isolated: true,
    controls: [
      { type: "switch", name: "enabled", label: "Enabled", defaultValue: true },
      { type: "slider", name: "size", label: "Size", min: 50, max: 200, defaultValue: 100 },
    ],
    children: ({ values }) => (
      <div
        className="rounded bg-blue-500 flex items-center justify-center text-white"
        style={{
          width: values.size as number,
          height: values.size as number,
          opacity: values.enabled ? 1 : 0.5,
        }}
      >
        {values.enabled ? "On" : "Off"}
      </div>
    ),
  },
};
