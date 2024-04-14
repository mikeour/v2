import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

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
    url: "https://www.linkedin.co/in/michaelroeslein",
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
    <main className="prose w-full max-w-[952px] prose-p:my-[0.8em]">
      <h1 className="mb-0 text-4xl font-extrabold tracking-tighter text-blue-100 lg:text-8xl">
        Hey, I&apos;m <br />
        <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
          Michael Roeslein
        </span>
      </h1>

      <p>I&apos;m a design-focused web developer living in Las Vegas, NV.</p>

      <p>
        I&apos;m excited to have this little corner of the internet to talk
        about all the things I love — whether it&apos;s sharing what{" "}
        <Link href="/music"> I&apos;m listening</Link>, what{" "}
        <Link href="/movies">I&apos;m watching</Link>, or writing about web
        development{" "}
        <Link href="/blog/elevate-your-web-development-stack-with-tailwind-css">
          here
        </Link>{" "}
        or{" "}
        <Link href="/blog/leveraging-the-power-of-react-and-typescript">
          maybe here
        </Link>
        .
      </p>

      <div className="mt-6 flex gap-4">
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
