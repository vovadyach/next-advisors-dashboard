import { Holding, HoldingsTableProps } from '@/app/components/HoldingsTable/HoldingsTable.types';
import { useEffect, useState } from 'react';
import { SkeletonGroup } from '@/app/components/Skeleton/Skeleton';
import { HOILDINGS_LABEL } from '@/app/components/HoldingsTable/Holdings.constants';

export function HoldingsTable({ accountId }: HoldingsTableProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      const res = await fetch(`/api/accounts/${accountId}`);
      const data = await res.json();
      setHoldings(data.data.holdings);
      setLoading(false);
    };

    fetchHoldings();
  }, [accountId]);

  if (loading) {
    return <SkeletonGroup rows={2} variant={'table'} />;
  }

  return (
    <div className="ml-8">
      <h4 className="font-medium mb-2">{HOILDINGS_LABEL}</h4>
      <table className="w-full bg-white rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Ticker</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-right">Units</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.id} className="border-t">
              <td className="p-2 font-mono font-medium">{holding.ticker}</td>
              <td className="p-2 text-gray-600">{holding.name}</td>
              <td className="p-2 text-right">{holding.units}</td>
              <td className="p-2 text-right">${holding.unitPrice.toFixed(2)}</td>
              <td className="p-2 text-right font-medium">
                ${holding?.totalValue?.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
