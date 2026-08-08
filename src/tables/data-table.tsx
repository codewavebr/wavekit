"use client";

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
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Modal,
  Table,
  useOverlayState,
} from "@heroui/react";

import { cn } from "../utils";

export function multiColumnFilterFn<TData>(
  row: Row<TData>,
  _columnId: string,
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

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchColumn?: string;
  statusColumn?: string;
  onDeleteRows?: (rows: TData[]) => void;
  onAddItem?: () => void;
  addButtonText?: string;
  searchPlaceholder?: string;
  renderRowActions?: (row: Row<TData>) => React.ReactNode;
};

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const deleteState = useOverlayState();

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

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) return [];
    const column = table.getColumn(statusColumn);
    if (!column) return [];
    return Array.from(column.getFacetedUniqueValues().keys()).map(String);
  }, [table, statusColumn]);

  useEffect(() => {
    if (statusColumn && uniqueStatusValues.length > 0) {
      setSelectedStatuses(uniqueStatusValues);
      table.getColumn(statusColumn)?.setFilterValue(undefined);
    }
  }, [uniqueStatusValues, statusColumn, table]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const column = table.getColumn(statusColumn!);
    if (!column) return;

    const newFilterValue = checked
      ? [...selectedStatuses, value]
      : selectedStatuses.filter((item) => item !== value);

    setSelectedStatuses(newFilterValue);

    if (newFilterValue.length === 0) {
      column.setFilterValue(["__NONE__"]);
    } else if (newFilterValue.length === uniqueStatusValues.length) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(newFilterValue);
    }
  };

  const handleDeleteRows = () => {
    if (!onDeleteRows) return;
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onDeleteRows(selectedRows);
    table.resetRowSelection();
    deleteState.close();
  };

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {searchColumn ? (
          <Input
            id={`${id}-search`}
            className="max-w-xs"
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(searchColumn)
                ?.setFilterValue(event.target.value)
            }
          />
        ) : null}

        {statusColumn && uniqueStatusValues.length > 0 ? (
          <Dropdown>
            <Dropdown.Trigger>
              <Button variant="outline">Status</Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu>
                {uniqueStatusValues.map((value) => (
                  <Dropdown.Item
                    key={value}
                    id={value}
                    textValue={value}
                    onAction={() =>
                      handleStatusChange(!selectedStatuses.includes(value), value)
                    }
                  >
                    <Checkbox
                      isSelected={selectedStatuses.includes(value)}
                      onChange={(checked) =>
                        handleStatusChange(Boolean(checked), value)
                      }
                    >
                      {value}
                    </Checkbox>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        ) : null}

        <div className="ml-auto flex gap-2">
          {selectedCount > 0 && onDeleteRows ? (
            <Button variant="danger" onPress={() => deleteState.open()}>
              <TrashIcon className="size-4" />
              Delete ({selectedCount})
            </Button>
          ) : null}
          {onAddItem ? (
            <Button onPress={onAddItem}>
              <PlusIcon className="size-4" />
              {addButtonText}
            </Button>
          ) : null}
        </div>
      </div>

      <div
        ref={tableContainerRef}
        className="max-h-[480px] overflow-auto rounded-xl border border-border"
      >
        <Table>
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.Column key={header.id} isRowHeader>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </Table.Column>
                    ))}
                    {renderRowActions ? (
                      <Table.Column isRowHeader>Actions</Table.Column>
                    ) : null}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <Table.Row
                      key={row.id}
                      className={cn(row.getIsSelected() && "bg-muted/40")}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Table.Cell>
                      ))}
                      {renderRowActions ? (
                        <Table.Cell>{renderRowActions(row)}</Table.Cell>
                      ) : null}
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </p>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="outline"
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            isIconOnly
            variant="outline"
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <Modal state={deleteState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Delete selected rows?</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                This action cannot be undone. {selectedCount} row(s) will be
                removed.
              </Modal.Body>
              <Modal.Footer className="flex gap-2">
                <Button variant="outline" onPress={() => deleteState.close()}>
                  Cancel
                </Button>
                <Button variant="danger" onPress={handleDeleteRows}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
