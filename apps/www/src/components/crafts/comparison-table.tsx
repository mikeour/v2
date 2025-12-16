import { cn } from "@mikeour/ui/utils";

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
    <div className={cn("not-prose my-6 overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-slate-700 border-b">
            {headers.map((header, i) => (
              <th
                className={cn(
                  "py-2 text-left font-medium text-slate-300",
                  i < headers.length - 1 && "pr-4"
                )}
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-400">
          {rows.map((row, rowIndex) => (
            <tr
              className={cn(
                rowIndex < rows.length - 1 && "border-slate-800 border-b"
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
