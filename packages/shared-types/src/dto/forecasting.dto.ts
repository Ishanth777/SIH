export interface CategoryForecastDto {
  category: string;
  expectedDemand: number;
  confidenceScore: number;
}

export interface ForecastResponseDto {
  date: string;
  forecasts: CategoryForecastDto[];
  isFallback?: boolean;
}
