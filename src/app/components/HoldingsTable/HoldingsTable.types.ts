export interface Holding {
  id: number;
  ticker: string;
  name: string;
  units: number;
  unitPrice: number;
  totalValue: number;
}

export interface HoldingsTableProps {
  accountId: number;
}
