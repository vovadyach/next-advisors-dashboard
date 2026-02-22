export interface Account {
  id: number;
  name: string;
  number: string;
  custodian: string;
  totalValue: number;
  holdingCount: number;
}

export interface AccountsTableProps {
  advisorId: string;
}
