import { Karla } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import "@code-hike/mdx/styles";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fira = localFont({
  src: "../../public/fonts/firacode-vf.woff2",
  variable: "--font-mono",
  display: "swap",
});

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
        className={`container min-h-full bg-zinc-900 py-32 text-white ${karla.className} ${fira.variable} flex items-center justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
