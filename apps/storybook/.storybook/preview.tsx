import type { Preview } from "@storybook/react";
import "./fonts.css";
import "../../www/src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#18181b" }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <article className="prose">
        <Story />
      </article>
    ),
  ],
};

export default preview;
