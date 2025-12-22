import type { MetadataRoute } from "next";

import { getCrafts } from "~/lib/crafts";

const baseUrl = "https://mikeour.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const crafts = await getCrafts();

  const craftUrls = crafts.map((craft) => ({
    url: `${baseUrl}/crafts/${craft.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/crafts`, lastModified: new Date() },
    ...craftUrls,
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
