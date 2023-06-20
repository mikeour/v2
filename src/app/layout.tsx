import { Karla } from "next/font/google";

import "./globals.css";

const karla = Karla({ subsets: ["latin"] });

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
    <html lang="en" className="h-full">
      <body
        className={`container min-h-full bg-zinc-900 py-32 text-white ${karla.className} flex items-center justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
