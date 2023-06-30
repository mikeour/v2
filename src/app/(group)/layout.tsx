import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[952px] flex-col gap-8">
      <Link href="/" className="self-start">
        Go Back
      </Link>

      {children}
    </div>
  );
}
