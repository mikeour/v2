import { cn } from "@mikeour/ui/lib/utils";

type ComparisonTableProps = {
  headers: string[];
  rows: string[][];
  className?: string;
};

export function ComparisonTable({
  headers,
  rows,
  className,
}: ComparisonTableProps) {
  return (
    <div
      className={cn(
        "not-prose my-6 overflow-x-auto rounded bg-white px-8 py-4",
        className
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-slate-700 border-b">
            {headers.map((header, i) => (
              <th
                className={cn(
                  "py-2 text-left font-semibold text-base text-slate-800",
                  i < headers.length - 1 && "pr-4"
                )}
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {rows.map((row, rowIndex) => (
            <tr
              className={cn(
                rowIndex < rows.length - 1 &&
                  "border-slate-500 border-b text-slate-700"
              )}
              key={rowIndex}
            >
              {row.map((cell, cellIndex) => (
                <td
                  className={cn("py-2", cellIndex < row.length - 1 && "pr-4")}
                  key={cellIndex}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
