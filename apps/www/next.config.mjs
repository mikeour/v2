import createMDX from "@next/mdx";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";

import theme from "./src/themes/one-monokai.mjs";

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme,
  },
};

/** @type {import('@next/mdx').NextMDXOptions} */
const mdxConfig = {
  options: {
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [[remarkCodeHike, chConfig], remarkToc],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
};

const withMDX = createMDX(mdxConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.ltrbxd.com" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/music",
        destination: "/music/page/1",
      },
      {
        source: "/movies",
        destination: "/movies/page/1",
      },
    ];
  },
};

export default withMDX(nextConfig);
