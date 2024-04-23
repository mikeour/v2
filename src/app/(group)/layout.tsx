import Link from "next/link";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="mx-auto flex w-full max-w-[952px] flex-col gap-8 py-[--gutter]">
      <Link href="/" className="self-start">
        Go Back
      </Link>

      {children}
    </div>
  );
}
