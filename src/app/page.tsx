import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import img from "./crafts/scroll-shadows/scroll-shadows.jpg";

const externalLinks = [
  {
    id: 1,
    name: "Github",
    url: "https://www.github.com/mikeour",
    Icon: Github,
  },
  {
    id: 2,
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/michaelroeslein",
    Icon: Linkedin,
  },
  {
    id: 3,
    name: "Twitter",
    url: "https://www.twitter.com/mikeour",
    Icon: Twitter,
  },
];

export default function Home() {
  return (
    <main className="prose mx-auto min-h-full w-full max-w-[952px] self-center py-16 prose-p:my-[0.8em]">
      <h1 className="mb-0 text-4xl font-extrabold tracking-tighter text-blue-100 lg:text-8xl">
        Hey, I&apos;m <br />
        <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
          Michael Roeslein
        </span>
      </h1>

      <p>
        I&apos;m a design-focused web developer living in Las Vegas,
        NV.
      </p>

      <p>
        I&apos;m excited to have this little corner of the internet to
        talk about all the things I love — whether it&apos;s sharing
        what music <Link href="/music"> I&apos;m listening</Link> to,
        what movies <Link href="/movies">I&apos;m watching</Link>{" "}
        lately, my favorite photos{" "}
        <Link href="/photos">I&apos;ve taken</Link>, or what I&apos;m
        writing about UI/UX:
      </p>

      <div className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          className="group flex flex-col gap-4 no-underline"
          href="/crafts/scroll-shadows"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[5/3]">
            <Image
              src={img}
              alt=""
              fill
              className="my-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-blue-400/0 transition-colors group-hover:bg-blue-400/20" />
          </div>

          <div className="not-prose flex flex-col gap-0">
            <span>April 22, 2024</span>
            <p className="transition-colors group-hover:text-gray-200">
              Scroll Shadows
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-24 flex gap-4">
        {externalLinks.map((externalLink) => {
          return (
            <a
              key={externalLink.id}
              href={externalLink.url}
              className="flex aspect-square w-11 shrink-0 items-center justify-center rounded bg-gray-800 p-3 transition-colors hover:bg-gray-700"
            >
              <externalLink.Icon fill="currentColor" size={18} />
              <span className="sr-only">{externalLink.name}</span>
            </a>
          );
        })}
      </div>
    </main>
  );
}
