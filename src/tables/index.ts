export * from "./data-table";

export type WaveTableColumn<TData> = {
  id: string;
  header: string;
  accessor?: keyof TData;
  sortable?: boolean;
};
