import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../../www/src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      nextConfigPath: resolve(__dirname, "../../www/next.config.ts"),
    },
  },
  features: {
    experimentalRSC: true,
  },
  viteFinal: (config) => {
    config.plugins = [...(config.plugins || []), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "~": resolve(__dirname, "../../www/src"),
      },
    };
    return config;
  },
};

export default config;
