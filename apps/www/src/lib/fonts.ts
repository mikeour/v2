import { Karla } from "next/font/google";
import localFont from "next/font/local";

export const karla = Karla({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fira = localFont({
  src: "../../public/fonts/firacode-vf.woff2",
  variable: "--font-mono",
  display: "swap",
});
