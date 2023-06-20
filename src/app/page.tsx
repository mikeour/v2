import Link from "next/link";
import { Github, LinkedIn, Twitter } from "~/components/icons";

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
    Icon: LinkedIn,
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
    <main className="mx-auto w-full max-w-[952px]">
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-blue-100 lg:text-8xl">
          Hey, I&apos;m <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
            Michael Roeslein
          </span>
        </h1>
        <div className="flex flex-col gap-2">
          <p>I&apos;m a design-focused web developer living in Brooklyn, NY.</p>
          <p>
            I&apos;m excited to have this little corner of the internet to talk
            about all the things I love — whether it&apos;s sharing what{" "}
            <Link href="/music"> I&apos;m listening</Link>, what{" "}
            <Link href="/movies">I&apos;m watching</Link>, or{" "}
            <span className="line-through decoration-blue-500 decoration-2">
              writing about web development
            </span>
            .
          </p>
        </div>

        <div className="flex gap-4">
          {externalLinks.map((externalLink) => {
            return (
              <a
                key={externalLink.id}
                href={externalLink.url}
                className="group"
              >
                <span className="sr-only">{externalLink.name}</span>
                <div className="flex aspect-square w-11 shrink-0 items-center justify-center rounded bg-gray-800 p-3 transition-colors group-hover:bg-gray-700 group-hover:text-blue-400">
                  <externalLink.Icon />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
