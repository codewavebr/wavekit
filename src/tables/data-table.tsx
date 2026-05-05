"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  EllipsisIcon,
  FilterIcon,
  Layout,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useId, useMemo, useRef, useState, useEffect } from "react";

// Custom filter functions
export function multiColumnFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string,
): boolean {
  const searchableRowContent = Object.values(
    row.original as Record<string, unknown>,
  )
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();

  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
}

export const customStatusFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue,
) => {
  if (filterValue?.includes("__NONE__")) return false;
  if (!filterValue) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchColumn?: string;
  statusColumn?: string;
  onDeleteRows?: (rows: TData[]) => void;
  onAddItem?: () => void;
  addButtonText?: string;
  searchPlaceholder?: string;
  renderRowActions?: (row: Row<TData>) => React.ReactNode;
}

export function DataTable<TData>({
  data,
  columns,
  searchColumn,
  statusColumn,
  onDeleteRows,
  onAddItem,
  addButtonText = "Add item",
  searchPlaceholder = "Filter...",
  renderRowActions,
}: DataTableProps<TData>) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleDeleteRows = () => {
    if (onDeleteRows) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onDeleteRows(selectedRows);
      table.resetRowSelection();
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    filterFns: {
      customStatus: customStatusFilterFn,
    },
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Set up virtualizer
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) return [];
    const column = table.getColumn(statusColumn);
    if (!column) return [];
    return Array.from(column.getFacetedUniqueValues().keys());
  }, [table, statusColumn]);

  // Initialize selected statuses
  useEffect(() => {
    if (statusColumn && uniqueStatusValues.length > 0) {
      setSelectedStatuses(uniqueStatusValues);
      table.getColumn(statusColumn)?.setFilterValue(undefined);
    }
  }, [uniqueStatusValues, statusColumn, table]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    if (!statusColumn) return new Map();
    const column = table.getColumn(statusColumn);
    if (!column) return new Map();
    return column.getFacetedUniqueValues();
  }, [table, statusColumn]);

  // Handle status filter changes
  const handleStatusChange = (checked: boolean, value: string) => {
    const column = table.getColumn(statusColumn!);
    if (!column) return;

    let newFilterValue: string[];

    if (checked) {
      newFilterValue = [...selectedStatuses, value];
    } else {
      newFilterValue = selectedStatuses.filter((v) => v !== value);
    }

    setSelectedStatuses(newFilterValue);

    if (newFilterValue.length === 0) {
      column.setFilterValue(["__NONE__"]);
    } else if (newFilterValue.length === uniqueStatusValues.length) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(newFilterValue);
    }
  };

  // Buscar o header da coluna de statusColumn
  const statusColumnHeader =
    columns.find(
      (col) =>
        ("accessorKey" in col && col.accessorKey === statusColumn) ||
        ("id" in col && col.id === statusColumn),
    )?.header ?? "Status";

  return (
    <div className="space-y-4">
      {/* Filters section */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Search input */}
          {searchColumn && (
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9",
                  Boolean(table.getColumn(searchColumn)?.getFilterValue()) &&
                    "pe-9",
                )}
                value={
                  (table.getColumn(searchColumn)?.getFilterValue() ??
                    "") as string
                }
                onChange={(e) =>
                  table.getColumn(searchColumn)?.setFilterValue(e.target.value)
                }
                placeholder={searchPlaceholder}
                type="text"
                aria-label="Filter"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {Boolean(table.getColumn(searchColumn)?.getFilterValue()) && (
                <button
                  type="button"
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    table.getColumn(searchColumn)?.setFilterValue("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Status filter */}
          {statusColumn && uniqueStatusValues.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon
                    className="-ms-1 mr-2 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  {typeof statusColumnHeader === "string"
                    ? statusColumnHeader
                    : "Status"}
                  {selectedStatuses.length > 0 &&
                    selectedStatuses.length < uniqueStatusValues.length && (
                      <span className="-me-1 ml-2 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                        {selectedStatuses.length}
                      </span>
                    )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}{" "}
                          <span className="ms-2 text-xs text-muted-foreground">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Layout
                  className="-ms-1 mr-2 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {onDeleteRows && table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Add item button */}
          {onAddItem && (
            <Button className="ml-auto" onClick={onAddItem}>
              <PlusIcon
                className="-ms-1 mr-2 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl border bg-card"
        ref={tableContainerRef}
        style={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width:
                          header.column.getSize() !== 150
                            ? `${header.column.getSize()}px`
                            : undefined,
                      }}
                      className="h-11 px-4"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows?.length ? (
              <>
                {/* Virtualized rows */}
                <tr
                  style={{
                    height: `${rowVirtualizer.getVirtualItems()[0]?.start || 0}px`,
                  }}
                />

                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      data-index={virtualRow.index}
                      ref={(el) => {
                        if (el) {
                          rowVirtualizer.measureElement(el);
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-4 last:py-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}

                {/* Virtualized padding */}
                <tr
                  style={{
                    height: `${
                      rowVirtualizer.getTotalSize() -
                      (rowVirtualizer.getVirtualItems()[
                        rowVirtualizer.getVirtualItems().length - 1
                      ]?.end || 0)
                    }px`,
                  }}
                />
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Page size selector */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Linhas por página
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
          <p
            className="whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )}
            </span>{" "}
            de{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination controls */}
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

// Default row actions component
export function DefaultRowActions<TData>({ row }: { row: Row<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
