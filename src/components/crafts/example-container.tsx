export function ExampleContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="not-prose flex items-center justify-center rounded-lg bg-[#2e3440ff] px-6 py-16">
      {children}
    </div>
  );
}
