import { Analytics } from "@vercel/analytics/react";
import { ScreenSize } from "~/components/utility/screen-size";
import { fira, karla } from "~/lib/fonts";

import "./globals.css";
import "@code-hike/mdx/styles";

export const metadata = {
  title: "mikeour.io",
  description: "Blog by mikeour",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark min-h-full overscroll-none">
      <link
        rel="icon"
        href={
          process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
            ? "/favicon.png"
            : "/favicon-dev.png"
        }
      />

      <body
        className={`flex min-h-[100dvh] w-full overscroll-none bg-zinc-900 px-[--gutter] ${karla.className} ${fira.variable}`}
      >
        {children}

        <ScreenSize />
        <Analytics />
      </body>
    </html>
  );
}
