'use client';

import { useEffect, useState } from 'react';
import { SkeletonGroup } from '@/app/components/Skeleton/Skeleton';
import {
  ADVISORS_LABEL,
  NO_STATS_DATA_LABEL,
  TOTAL_ASSETS_LABEL,
} from '@/app/components/Stats/Stats.constants';
import { ACCOUNTS_LABEL } from '@/app/shared/constants';

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/stats`);
      const data = await res.json();
      setStats(data.data);
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <SkeletonGroup rows={3} variant={'stats'} />;
  }

  if (!stats) {
    return <div className="text-sm text-gray-500">{NO_STATS_DATA_LABEL}</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">{TOTAL_ASSETS_LABEL}</p>
        <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">{ADVISORS_LABEL}</p>
        <p className="text-2xl font-bold">{stats.advisorCount}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">{ACCOUNTS_LABEL}</p>
        <p className="text-2xl font-bold">{stats.accountCount}</p>
      </div>
    </div>
  );
}
