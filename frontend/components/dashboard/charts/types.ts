/**
 * Type definitions for chart components
 */

export interface ChartDataItem {
  [key: string]: string | number;
}

export interface DistributionDataItem {
  difficulty?: string;
  type?: string;
  count: number;
}

export interface TrendDataItem {
  period: string;
  completions: number;
  date?: string;
}

export interface ChartColors {
  primary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  secondary: string;
}
