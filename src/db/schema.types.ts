// ============ TYPES (matching JSON structure) ============
export interface AdvisorJSON {
  id: string;
  name: string;
  custodians: { name: string; repId: string }[];
}

export interface AccountJSON {
  name: string;
  number: string;
  repId: string;
  custodian: string;
  holdings: { ticker: string; units: number; unitPrice: number }[];
}

export interface SecurityJSON {
  id: string;
  ticker: string;
  name: string;
  dateAdded: string;
}
