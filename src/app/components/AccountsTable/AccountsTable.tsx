'use client';

import { Account, AccountsTableProps } from '@/app/components/AccountsTable/AccountsTable.types';
import { SkeletonGroup } from '@/app/components/Skeleton/Skeleton';
import { Fragment, useEffect, useState } from 'react';
import { ACCOUNTS_LABEL } from '@/app/shared/constants';
import { HoldingsTable } from '@/app/components/HoldingsTable/HoldingsTable';

export function AccountsTable({ advisorId }: AccountsTableProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch(`/api/advisors/${advisorId}`);
      const data = await res.json();
      setAccounts(data.data.accounts);
      setLoading(false);
    };

    fetchAccounts();
  }, [advisorId]);

  if (loading) {
    return <SkeletonGroup rows={2} variant={'table'} />;
  }

  return (
    <div className="ml-8">
      <h4 className="font-medium mb-2">{ACCOUNTS_LABEL}</h4>
      <table className="w-full bg-white rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left w-8"></th>
            <th className="p-2 text-left">Account Name</th>
            <th className="p-2 text-left">Number</th>
            <th className="p-2 text-left">Custodian</th>
            <th className="p-2 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map((account) => (
            <Fragment key={account.id}>
              <tr
                key={account.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedId(expandedId === account.id ? null : account.id)}
              >
                <td className="p-2">{expandedId === account.id ? '▼' : '▶'}</td>
                <td className="p-2">{account.name}</td>
                <td className="p-2 font-mono text-sm">{account.number}</td>
                <td className="p-2">{account.custodian}</td>
                <td className="p-2 text-right">${account?.totalValue?.toLocaleString()}</td>
              </tr>

              {expandedId === account.id && (
                <tr>
                  <td colSpan={5} className="bg-gray-100 p-2">
                    <HoldingsTable accountId={account.id} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
