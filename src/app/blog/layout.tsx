export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose mx-auto w-full max-w-[752px] prose-headings:scroll-m-8 prose-headings:text-white prose-a:text-blue-400 prose-strong:text-gray-200 prose-code:text-white prose-code:before:hidden prose-code:after:hidden">
      {children}
    </article>
  );
}
