import { DynamicBreadcrumbs } from "~/components/dynamic-breadcrumbs";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="mx-auto flex w-full max-w-238 flex-col gap-8 py-(--gutter)">
      <DynamicBreadcrumbs />

      {children}
    </div>
  );
}
