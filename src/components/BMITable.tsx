import { createSignal, For } from "solid-js";
import {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/solid-table";
import type { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/solid-table";

export type BmiRecord = {
  date: string;
  name: string;
  weight: number;
  height: number;
  bmi: number;
};

interface BMITableProps {
  history: Array<[string, Date, number, number]>;
}

const columns: ColumnDef<BmiRecord>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "weight",
    header: "Weight (kg)",
    cell: (info) => {
      const val = info.getValue();
      return typeof val === "number" && val > 0 ? val.toString() : "-";
    }
  },
  {
    accessorKey: "height",
    header: "Height (cm)",
    cell: (info) => {
      const val = info.getValue();
      return typeof val === "number" && val > 0 ? val.toString() : "-";
    }
  },
  {
    accessorKey: "bmi",
    header: "BMI",
    cell: (info) => {
      const val = info.getValue();
      return typeof val === "number" ? val.toFixed(2) : "";
    }
  },
];

export default function BMITable(props: BMITableProps) {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);

  // Map the raw history tuples to BmiRecord objects
  const tableData = () => {
    const list: BmiRecord[] = [];
    for (let i = 0; i < props.history.length; i++) {
      const item = props.history[i];
      // Tuple is [name, date, weight, height]
      const nameVal = typeof item[0] === "string" ? item[0] : "";
      const dateVal = item[1] instanceof Date ? item[1].toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
      const weightVal = typeof item[2] === "number" ? item[2] : 0;
      const heightVal = typeof item[3] === "number" ? item[3] : 0;

      // Calculate BMI at runtime
      const heightInMeters = heightVal / 100;
      const bmiVal = heightInMeters > 0 ? weightVal / (heightInMeters * heightInMeters) : 0;

      list.push({
        date: dateVal,
        name: nameVal,
        weight: weightVal,
        height: heightVal,
        bmi: bmiVal,
      });
    }
    return list;
  };

  const table = createSolidTable({
    get data() {
      return tableData();
    },
    columns,
    state: {
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div class="w-full h-full max-h-[460px] overflow-y-auto box-border pr-1 select-none">
      <div class="border border-space-convoy/30 rounded-[8px] overflow-hidden bg-kala-black">
        <table class="w-full border-collapse text-left text-sm text-vintage-charm">
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <>
                  {/* Header Labels & Sorting */}
                  <tr class="border-b border-space-convoy/20 bg-cape-storm">
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th class="p-2.5 font-bold text-space-convoy text-xs whitespace-nowrap">
                          <Show when={!header.isPlaceholder}>
                            <div
                              onClick={header.column.getToggleSortingHandler()}
                              class="cursor-pointer select-none flex items-center justify-between gap-1 hover:text-all-systems-red"
                            >
                              <span>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              <span class="text-[10px]">
                                {header.column.getIsSorted() === "asc"
                                  ? " ▲"
                                  : header.column.getIsSorted() === "desc"
                                  ? " ▼"
                                  : " ↕"}
                              </span>
                            </div>
                          </Show>
                        </th>
                      )}
                    </For>
                  </tr>
                  {/* Column Filters */}
                  <tr class="border-b border-space-convoy/15 bg-cape-storm/50">
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th class="p-2">
                          <Show when={!header.isPlaceholder}>
                            <input
                              type="text"
                              value={(header.column.getFilterValue() as string | undefined) ?? ""}
                              onInput={(e) => header.column.setFilterValue(e.currentTarget.value)}
                              placeholder="Filter..."
                              class="w-full text-[11px] p-1.5 rounded bg-kala-black text-vintage-charm border border-space-convoy/10 outline-none font-normal"
                            />
                          </Show>
                        </th>
                      )}
                    </For>
                  </tr>
                </>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows}>
              {(row) => (
                <tr class="border-b border-space-convoy/10 hover:bg-space-convoy/5 transition-colors duration-150">
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td class="p-2 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}
