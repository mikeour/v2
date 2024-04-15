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
    <html lang="en" className="dark h-full">
      <body
        className={`container min-h-full bg-zinc-900 py-16 text-white ${karla.className} ${fira.variable} flex items-center justify-center`}
      >
        {children}

        {/* <ScreenSize /> */}
        <Analytics />
      </body>
    </html>
  );
}
