import ScrollContainer from "./scroll-container";

export function List() {
  return (
    <ScrollContainer>
      <ul className="flex max-h-[400px] w-[300px] flex-col gap-2 rounded-lg bg-white shadow-lg">
        {Array.from({ length: 30 }).map((_, index) => {
          return (
            <li key={index} className="flex items-center justify-center">
              Item {index + 1}
            </li>
          );
        })}
      </ul>
    </ScrollContainer>
  );
}
