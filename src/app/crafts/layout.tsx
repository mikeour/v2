import Link from "next/link";

import type { Metadata } from "next";

const url = new URL("https://mikeour.io");

export const metadata: Metadata = {
  title: "Scroll Shadows",
  description:
    "Scroll shadows are a visual effect often used to indicate that there is more content to be scrolled in a particular direction, usually beyond the current viewport.",
  openGraph: {
    type: "website",
    url,
    title: "mikeour.io",
    description: "mikeour.io's blog",
    siteName: "mikeour.io",
    images: [
      {
        url: url.toString() + "/api/og",
      },
    ],
  },
};

export default function Layout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="mx-auto flex w-full max-w-[752px] flex-col gap-8 py-[--gutter]">
      <Link href="/" className="self-start">
        Go Back
      </Link>

      <article className="prose mt-10 w-full max-w-full prose-headings:scroll-m-8 prose-headings:text-white prose-strong:text-gray-200 prose-code:text-blue-400 prose-code:before:hidden prose-code:after:hidden">
        {children}
      </article>
    </div>
  );
}
