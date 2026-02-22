export interface Advisor {
  id: string;
  name: string;
  custodians: string[];
  totalAssets: number;
  accountCount: number;
}

export type SortField = 'name' | 'totalAssets';
export type SortOrder = 'asc' | 'desc';
