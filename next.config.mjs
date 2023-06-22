import { remarkCodeHike } from "@code-hike/mdx";
import withMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";

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
          theme: "nord",
        },
      ],
      remarkToc,
    ],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    domains: ["a.ltrbxd.com", "i.scdn.co"],
  },
};

export default withMDX(mdxConfig)(nextConfig);
