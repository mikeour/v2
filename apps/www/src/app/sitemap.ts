import type { MetadataRoute } from "next";

const baseUrl = "https://mikeour.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/crafts`, lastModified: new Date() },
    { url: `${baseUrl}/crafts/scroll-shadows`, lastModified: new Date() },
    { url: `${baseUrl}/crafts/scroll-shadows-pt-2`, lastModified: new Date() },
    { url: `${baseUrl}/photos`, lastModified: new Date() },
    { url: `${baseUrl}/music`, lastModified: new Date() },
    { url: `${baseUrl}/movies`, lastModified: new Date() },
    {
      url: `${baseUrl}/blog/elevate-your-web-development-stack-with-tailwind-css`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog/leveraging-the-power-of-react-and-typescript`,
      lastModified: new Date(),
    },
  ];
}
