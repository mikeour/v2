import { DynamicBreadcrumbs } from "~/components/dynamic-breadcrumbs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-188 flex-col gap-8 py-(--gutter)">
      <DynamicBreadcrumbs />

      <article className="prose w-full max-w-full prose-headings:scroll-m-8 prose-code:text-white prose-headings:text-white prose-strong:text-gray-200 prose-code:before:hidden prose-code:after:hidden">
        {children}
      </article>
    </div>
  );
}
