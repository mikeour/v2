import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[752px] flex-col gap-8 py-[--gutter]">
      <Link className="self-start" href="/">
        Go Back
      </Link>

      <article className="prose w-full max-w-full prose-headings:scroll-m-8 prose-code:text-white prose-headings:text-white prose-strong:text-gray-200 prose-code:before:hidden prose-code:after:hidden">
        {children}
      </article>
    </div>
  );
}
