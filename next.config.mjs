import { remarkCodeHike } from "@code-hike/mdx";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import theme from "./src/themes/one-monokai.mjs";

/** @type {import('@next/mdx').NextMDXOptions} */
const mdxConfig = {
  options: {
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [
      [
        remarkCodeHike,
        {
          lineNumbers: false,
          showCopyButton: true,
          theme,
        },
      ],
      remarkToc,
    ],
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
