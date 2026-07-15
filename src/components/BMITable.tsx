import { createSignal, For, Show } from "solid-js";
import {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/solid-table";
import type { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/solid-table";
import { Trash2 } from "lucide-solid";

export type StudyRecord = {
  date: string;
  subject: string;
  chapters: number;
  time: number;
  speed: number;
  originalIndex: number;
};

interface StudyTableProps {
  history: Array<[string, Date, number, number]>;
  onDelete?: (index: number) => void;
}

export default function StudyTable(props: StudyTableProps) {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);

  const columns: ColumnDef<StudyRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "chapters",
      header: "Chapters",
      cell: (info) => {
        const val = info.getValue();
        return typeof val === "number" && val > 0 ? val.toString() : "-";
      }
    },
    {
      accessorKey: "time",
      header: "Time",
      filterFn: (row, _columnId, filterValue) => {
        const val = row.getValue("time") as number;
        if (typeof val !== "number" || val <= 0) return false;
        const h = Math.floor(val / 60);
        const m = val % 60;
        const display = h > 0 ? `${h}h ${m}m` : `${m}m`;
        return display.toLowerCase().includes(String(filterValue).toLowerCase());
      },
      cell: (info) => {
        const val = info.getValue();
        if (typeof val !== "number" || val <= 0) return "-";
        const h = Math.floor(val / 60);
        const m = val % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
      }
    },
    {
      accessorKey: "speed",
      header: "Speed",
      cell: (info) => {
        const val = info.getValue();
        const row = info.row.original;
        return (
          <div class="flex items-center justify-between gap-1">
            <span>{typeof val === "number" ? val.toFixed(2) : ""}</span>
            <button
              onClick={() => props.onDelete?.(row.originalIndex)}
              class="text-ember hover:text-all-systems-red transition-colors cursor-pointer shrink-0"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      }
    },
  ];

  // Map the raw history tuples to StudyRecord objects
  const tableData = () => {
    const list: StudyRecord[] = [];
    for (let i = 0; i < props.history.length; i++) {
      const item = props.history[i];
      // Tuple is [subject, date, chapters, totalMinutes]
      const subjectVal = typeof item[0] === "string" ? item[0] : "";
      const dateVal = item[1] instanceof Date ? item[1].toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
      const chaptersVal = typeof item[2] === "number" ? item[2] : 0;
      const timeVal = typeof item[3] === "number" ? item[3] : 0;

      const speedVal = chaptersVal > 0 ? timeVal / chaptersVal : 0;

      list.push({
        date: dateVal,
        subject: subjectVal,
        chapters: chaptersVal,
        time: timeVal,
        speed: speedVal,
        originalIndex: i,
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
                      <td class="p-2 align-middle whitespace-nowrap">
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
