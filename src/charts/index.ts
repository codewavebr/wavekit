export { AreaChartComponent, type AttendanceData } from "./area-chart";
export * from "./chart";
export { DonutChartComponent, type PlanData } from "./donut-chart";
export {
  MultipleBarChartComponent,
  type WorkoutData,
} from "./multiple-bar-chart";
export {
  StackedBarChartComponent,
  type RevenueData,
} from "./stacked-bar-chart";

export type WaveChartDatum = Record<string, string | number | null>;

export type WaveChartColor = {
  key: string;
  color: string;
};
