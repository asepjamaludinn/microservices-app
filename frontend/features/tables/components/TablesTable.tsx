import TableRow from "./TableRow";
import type { TableStatus } from "@/types/table";

interface TablesTableProps {
  processedTables: any[];
  changeStatus: (id: number, status: TableStatus) => void;
  handleDelete: (id: number, number: string) => void;
}

export default function TablesTable({
  processedTables,
  changeStatus,
  handleDelete,
}: TablesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-400 font-semibold uppercase bg-white border-b border-slate-100">
          <tr>
            <th className="px-6 py-4">Table</th>
            <th className="px-6 py-4">Area</th>
            <th className="px-6 py-4">Capacity</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Updated</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
          {processedTables.map((table) => (
            <TableRow
              key={table.id}
              table={table}
              changeStatus={changeStatus}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
